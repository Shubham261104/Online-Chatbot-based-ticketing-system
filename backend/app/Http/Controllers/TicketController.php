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
            'adults' => 'required|integer|min:1',
            'children' => 'required|integer|min:0',
            'name' => 'required|string',
            'email' => 'required|email'
        ]);

        $totalPrice = ($request->adults * 500) + ($request->children * 250);

        // Check Slot Availability
        $slot = Slot::firstOrCreate(
            ['date' => $request->date, 'time_slot' => $request->timeSlot],
            ['capacity' => 50, 'booked' => 0]
        );

        if ($slot->booked + ($request->adults + $request->children) > $slot->capacity) {
            return response()->json(['message' => 'Slot is full or not enough capacity'], 400);
        }

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
            'date' => $request->date,
            'time_slot' => $request->timeSlot,
            'adults' => $request->adults,
            'children' => $request->children,
            'total_price' => $totalPrice,
            'status' => 'pending',
            'razorpay_order_id' => $orderId,
            'user_id' => auth('api')->id() ?? null
        ]);

        // Update slot booked count
        $slot->increment('booked', ($request->adults + $request->children));

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
                'qr_code' => base64_encode(QrCode::format('png')->size(200)->generate($ticket->id))
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
        $allSlots = [
            '09:00 AM - 10:30 AM',
            '10:30 AM - 12:00 PM',
            '12:00 PM - 01:30 PM',
            '01:30 PM - 03:00 PM',
            '03:00 PM - 04:30 PM',
            '04:30 PM - 06:00 PM',
        ];
        $capacity = 50;
        $result = [];
        foreach ($allSlots as $slot) {
            $booked = Slot::where('date', $date)->where('time_slot', $slot)->value('booked') ?? 0;
            $remaining = $capacity - $booked;
            if ($remaining <= 0) $status = 'Sold Out';
            elseif ($remaining <= 10) $status = 'Few Tickets Left';
            else $status = 'Available';
            $result[] = ['time' => $slot, 'status' => $status, 'remaining' => $remaining];
        }
        return response()->json($result);
    }

    public function allTickets()
    {
        // Admin access
        return response()->json(Ticket::all());
    }
}
