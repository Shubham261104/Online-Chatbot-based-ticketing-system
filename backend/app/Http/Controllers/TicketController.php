<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\Slot;
use Illuminate\Http\Request;
use Razorpay\Api\Api as RazorpayApi;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class TicketController extends Controller
{
    public function book(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'timeSlot' => 'required|string',
            'adults' => 'required|integer|min:0',
            'children' => 'required|integer|min:0',
            'students' => 'required|integer|min:0',
            'females' => 'required|integer|min:0',
            'seniors' => 'required|integer|min:0',
            'foreigners' => 'required|integer|min:0',
            'name' => 'required|string',
            'email' => 'required|email'
        ]);

        $slot = Slot::where('date', $request->date)
            ->where('time_slot', $request->timeSlot)
            ->first();

        if (!$slot) {
            return response()->json(['message' => 'Invalid slot selected'], 400);
        }

        $totalVisitors = $request->adults + $request->children + $request->students + $request->females + $request->seniors + $request->foreigners;
        
        if ($totalVisitors <= 0) {
            return response()->json(['message' => 'At least one visitor is required'], 400);
        }

        if ($slot->booked + $totalVisitors > $slot->capacity) {
            return response()->json(['message' => 'Slot is full or not enough capacity'], 400);
        }

        $basePrice = $slot->price;
        $bookingFee = \App\Models\Setting::where('key', 'booking_fee')->value('value') ?? 50;
        
        $ticketType = $request->ticket_type ?? 'General';
        $extraCharges = [
            'General' => 0,
            'Premium' => 150,
            'VIP' => 400
        ];
        $extraCharge = $extraCharges[$ticketType] ?? 0;
        $effectivePrice = $basePrice + $extraCharge;

        $multipliers = [
            'adults' => 1.0,
            'children' => 0.5,
            'students' => 0.5,
            'females' => 0.8,
            'seniors' => 0.7,
            'foreigners' => 2.0
        ];

        $totalPrice = ($request->adults * $effectivePrice * $multipliers['adults']) +
                      ($request->children * $effectivePrice * $multipliers['children']) +
                      ($request->students * $effectivePrice * $multipliers['students']) +
                      ($request->females * $effectivePrice * $multipliers['females']) +
                      ($request->seniors * $effectivePrice * $multipliers['seniors']) +
                      ($request->foreigners * $effectivePrice * $multipliers['foreigners']) +
                      $bookingFee;

        // Razorpay Order Creation
        try {
            $api = new RazorpayApi(env('RAZORPAY_KEY'), env('RAZORPAY_SECRET'));
            $order = $api->order->create([
                'receipt' => 'order_rcptid_'.time(),
                'amount' => $totalPrice * 100, // in paise
                'currency' => 'INR'
            ]);
            $orderId = $order['id'];
        } catch (\Exception $e) {
            $orderId = 'mock_order_' . time();
        }

        $ticket = Ticket::create([
            'visitor_name' => $request->name,
            'visitor_email' => $request->email,
            'event_name' => $request->event_name ?? null,
            'date' => $request->date,
            'time_slot' => $request->timeSlot,
            'adults' => $request->adults,
            'children' => $request->children,
            'students' => $request->students,
            'females' => $request->females,
            'seniors' => $request->seniors,
            'foreigners' => $request->foreigners,
            'total_price' => $request->total_price ?? $totalPrice,
            'status' => 'pending',
            'razorpay_order_id' => $orderId,
            'user_id' => auth('api')->id() ?? null
        ]);

        // Update slot booked count
        $slot->increment('booked', $totalVisitors);

        return response()->json([
            'ticket' => $ticket,
            'razorpay_order_id' => $orderId
        ]);
    }

    public function verifyPayment(Request $request)
    {
        $ticket = Ticket::where('razorpay_order_id', $request->order_id)->first();
        
        if ($ticket) {
            $ticket->update([
                'status' => 'paid',
                'razorpay_payment_id' => $request->payment_id,
                'qr_code' => base64_encode(QrCode::format('svg')->size(200)->generate($ticket->id))
            ]);

            return response()->json(['message' => 'Payment verified', 'ticket' => $ticket]);
        }

        return response()->json(['error' => 'Ticket not found'], 404);
    }

    public function userHistory()
    {
        $tickets = Ticket::where('user_id', auth()->id())->get();
        return response()->json($tickets);
    }
    
    public function getSlots(Request $request)
    {
        $date = $request->query('date', now()->toDateString());
        
        $times = [
            '09:00 AM - 10:30 AM', '10:30 AM - 12:00 PM', '12:00 PM - 01:30 PM', '01:30 PM - 03:00 PM',
            '03:00 PM - 04:30 PM', '04:30 PM - 06:00 PM', '06:00 PM - 07:30 PM', '07:30 PM - 09:00 PM'
        ];

        // Ensure slots exist for this date and match the new 8-slot structure
        $slots = Slot::where('date', $date)->get();
        
        if ($slots->count() !== count($times)) {
            // Remove old/invalid slots to regenerate them correctly
            Slot::where('date', $date)->delete();
            
            $defaultCapacity = \App\Models\Setting::where('key', 'default_capacity')->value('value') ?? 50;
            $defaultPrice = \App\Models\Setting::where('key', 'ticket_price')->value('value') ?? 500;
            
            foreach ($times as $time) {
                Slot::create([
                    'date' => $date,
                    'time_slot' => $time,
                    'capacity' => $defaultCapacity,
                    'price' => $defaultPrice,
                    'booked' => 0
                ]);
            }
            $slots = Slot::where('date', $date)->get();
        }

        $result = [];
        $now = now();
        $isToday = $date === $now->toDateString();

        foreach ($slots as $slot) {
            $remaining = $slot->capacity - $slot->booked;
            
            // Parse slot start time for "Time Passed" check
            try {
                // Extract start time from range (e.g. "09:00 AM" from "09:00 AM - 10:30 AM")
                $startTimeStr = explode(' - ', $slot->time_slot)[0];
                $slotStartTime = \Carbon\Carbon::createFromFormat('h:i A', $startTimeStr, $now->timezone);
                $isPassed = $isToday && $now->greaterThanOrEqualTo($slotStartTime);
            } catch (\Exception $e) {
                $isPassed = false;
            }
            
            if ($isPassed) {
                $status = 'Time Passed';
                $remaining = 0;
            } elseif ($remaining <= 0) {
                $status = 'Sold Out';
            } elseif ($remaining <= 10) {
                $status = 'Few Tickets Left';
            } else {
                $status = 'Available';
            }
            
            $result[] = [
                'time' => $slot->time_slot, 
                'status' => $status, 
                'remaining' => $remaining,
                'price' => $slot->price,
                'capacity' => $slot->capacity
            ];
        }
        return response()->json($result);
    }

    public function allTickets()
    {
        // Admin access
        return response()->json(Ticket::latest()->get());
    }

    public function getAdminStats()
    {
        $totalBookings = Ticket::where('status', 'paid')->count();
        $totalRevenue = Ticket::where('status', 'paid')->sum('total_price');
        $totalUsers = \App\Models\User::count();
        $recentTickets = Ticket::latest()->take(10)->get();

        // Calculate peak hours
        $popularSlots = Ticket::select('time_slot', \DB::raw('count(*) as count'))
            ->where('status', 'paid')
            ->groupBy('time_slot')
            ->orderByDesc('count')
            ->take(3)
            ->get();

        // Calculate peak days
        $popularDays = Ticket::select(\DB::raw('DAYNAME(date) as day'), \DB::raw('count(*) as count'))
            ->where('status', 'paid')
            ->groupBy('day')
            ->orderByDesc('count')
            ->take(3)
            ->get();

        // Revenue trends (Last 10 entries)
        $revenueTrends = Ticket::select(\DB::raw('date'), \DB::raw('SUM(total_price) as revenue'))
            ->where('status', 'paid')
            ->groupBy('date')
            ->orderBy('date', 'desc')
            ->take(10)
            ->get()
            ->reverse()
            ->values();

        // Booking trends (Last 10 entries)
        $bookingTrends = Ticket::select(\DB::raw('date'), \DB::raw('count(*) as count'))
            ->where('status', 'paid')
            ->groupBy('date')
            ->orderBy('date', 'desc')
            ->take(10)
            ->get()
            ->reverse()
            ->values();

        // User registration trends (Last 10 entries)
        $userTrends = \App\Models\User::select(\DB::raw('DATE(created_at) as date'), \DB::raw('count(*) as count'))
            ->groupBy('date')
            ->orderBy('date', 'desc')
            ->take(10)
            ->get()
            ->reverse()
            ->values();

        // Mock System Health trends
        $healthTrends = collect([
            ['date' => now()->subDays(4)->toDateString(), 'health' => 99.8],
            ['date' => now()->subDays(3)->toDateString(), 'health' => 99.9],
            ['date' => now()->subDays(2)->toDateString(), 'health' => 100.0],
            ['date' => now()->subDays(1)->toDateString(), 'health' => 99.7],
            ['date' => now()->toDateString(), 'health' => 99.9],
        ]);

        return response()->json([
            'totalBookings' => $totalBookings,
            'totalRevenue' => $totalRevenue,
            'totalUsers' => $totalUsers,
            'recentTickets' => $recentTickets,
            'popularSlots' => $popularSlots,
            'popularDays' => $popularDays,
            'revenueTrends' => $revenueTrends,
            'bookingTrends' => $bookingTrends,
            'userTrends' => $userTrends,
            'healthTrends' => $healthTrends
        ]);
    }

    public function getUsers()
    {
        return response()->json(\App\Models\User::all());
    }

    public function createUser(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'in:user,admin'
        ]);

        $user = \App\Models\User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => \Illuminate\Support\Facades\Hash::make($request->password),
            'role' => $request->role ?? 'user',
            'status' => 'active'
        ]);

        return response()->json($user, 201);
    }

    public function deleteUser($id)
    {
        $user = \App\Models\User::find($id);
        if (!$user) return response()->json(['message' => 'User not found'], 404);
        
        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }

    public function blockUser(Request $request, $id)
    {
        $user = \App\Models\User::find($id);
        if (!$user) return response()->json(['message' => 'User not found'], 404);

        $user->update([
            'status' => 'blocked',
            'block_reason' => $request->reason ?? 'No reason provided'
        ]);

        return response()->json(['message' => 'User blocked successfully', 'user' => $user]);
    }

    public function unblockUser($id)
    {
        $user = \App\Models\User::find($id);
        if (!$user) return response()->json(['message' => 'User not found'], 404);

        $user->update([
            'status' => 'active',
            'block_reason' => null
        ]);

        return response()->json(['message' => 'User unblocked successfully', 'user' => $user]);
    }

    public function getChatLogs()
    {
        return response()->json(\App\Models\ChatLog::with('user')->latest()->get());
    }

    public function getSettings()
    {
        $settings = \App\Models\Setting::pluck('value', 'key')->toArray();
        return response()->json([
            'default_capacity' => $settings['default_capacity'] ?? 50,
            'ticket_price' => $settings['ticket_price'] ?? 500,
            'booking_fee' => $settings['booking_fee'] ?? 50,
        ]);
    }

    public function updateSettings(Request $request)
    {
        $data = $request->validate([
            'default_capacity' => 'required|numeric|min:1',
            'ticket_price' => 'required|numeric|min:0',
            'booking_fee' => 'required|numeric|min:0',
            'visitor_types' => 'nullable|array',
        ]);

        foreach ($data as $key => $value) {
            \App\Models\Setting::updateOrCreate(
                ['key' => $key],
                ['value' => is_array($value) ? json_encode($value) : $value]
            );
        }

        return response()->json(['message' => 'Settings updated successfully']);
    }

    public function getAdminSeating(Request $request)
    {
        $date = $request->date ?? date('Y-m-d');
        $times = [
            '09:00 AM - 10:30 AM', '10:30 AM - 12:00 PM', '12:00 PM - 01:30 PM', '01:30 PM - 03:00 PM',
            '03:00 PM - 04:30 PM', '04:30 PM - 06:00 PM', '06:00 PM - 07:30 PM', '07:30 PM - 09:00 PM'
        ];

        $slots = Slot::where('date', $date)->get();
        
        // If slots don't exist or don't match the new 8-slot structure, recreate them
        if ($slots->count() !== count($times)) {
            Slot::where('date', $date)->delete();
            
            $defaultCapacity = \App\Models\Setting::where('key', 'default_capacity')->value('value') ?? 50;
            $defaultPrice = \App\Models\Setting::where('key', 'ticket_price')->value('value') ?? 500;
            
            foreach ($times as $time) {
                Slot::create([
                    'date' => $date,
                    'time_slot' => $time,
                    'capacity' => $defaultCapacity,
                    'price' => $defaultPrice,
                    'booked' => 0
                ]);
            }
            $slots = Slot::where('date', $date)->get();
        }

        return response()->json($slots);
    }

    public function bulkUpdateSlots(Request $request)
    {
        $request->validate([
            'slots' => 'required|array',
            'slots.*.id' => 'required|exists:slots,id',
            'slots.*.capacity' => 'required|numeric|min:0',
            'slots.*.price' => 'required|numeric|min:0',
        ]);

        foreach ($request->slots as $slotData) {
            Slot::where('id', $slotData['id'])->update([
                'capacity' => $slotData['capacity'],
                'price' => $slotData['price'],
            ]);
        }

        return response()->json(['message' => 'Slots updated successfully']);
    }

    public function cancel(Request $request, $id)
    {
        $ticket = Ticket::where('id', $id)->where('user_id', auth()->id())->first();

        if (!$ticket) {
            return response()->json(['message' => 'Ticket not found or unauthorized'], 404);
        }

        if (in_array($ticket->status, ['cancelled', 'refunded'])) {
            return response()->json(['message' => 'Ticket is already cancelled or refunded'], 400);
        }

        $ticket->cancellation_reason = $request->reason ?? 'No reason provided';

        // Handle Refund if paid
        if ($ticket->status === 'paid' && $ticket->razorpay_payment_id) {
            try {
                $api = new RazorpayApi(env('RAZORPAY_KEY'), env('RAZORPAY_SECRET'));
                $payment = $api->payment->fetch($ticket->razorpay_payment_id);
                $payment->refund([
                    'amount' => $ticket->total_price * 100 // Refund full amount in paise
                ]);
                $ticket->status = 'refunded';
            } catch (\Exception $e) {
                // If refund fails (e.g. mock keys/unsupported), we still allow cancellation
                $ticket->status = 'cancelled';
            }
        } else {
            $ticket->status = 'cancelled';
        }

        $ticket->save();

        // Release slot capacity
        $slot = Slot::where('date', $ticket->date)->where('time_slot', $ticket->time_slot)->first();
        if ($slot) {
            $totalVisitors = $ticket->adults + $ticket->children + $ticket->students + $ticket->females + $ticket->seniors + $ticket->foreigners;
            $slot->decrement('booked', $totalVisitors);
        }

        return response()->json([
            'message' => 'Ticket cancelled successfully',
            'ticket' => $ticket
        ]);
    }
}
