<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Ticket;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'ticket_id' => 'required|exists:tickets,id',
            'amount' => 'required|numeric',
            'payment_status' => 'required|string',
            'method' => 'required|string',
            'transaction_id' => 'nullable|string',
        ]);

        $payment = Payment::create($request->all());

        if ($request->payment_status === 'successful') {
            $ticket = Ticket::find($request->ticket_id);
            $ticket->update(['status' => 'paid']);
            
            // Create booking notification in DB
            $eventName = $ticket->event_name ?? 'Museum Tour';
            if ($ticket->user_id) {
                \App\Models\Notification::create([
                    'user_id' => $ticket->user_id,
                    'type' => 'success',
                    'title' => 'Booking Confirmed!',
                    'message' => "Your ticket for {$eventName} on {$ticket->date} ({$ticket->time_slot}) has been successfully booked. Ticket ID: #{$ticket->id}.",
                    'is_read' => false
                ]);
            }
        }

        return response()->json([
            'message' => 'Payment recorded successfully',
            'payment' => $payment
        ], 201);
    }

    public function getPayments()
    {
        return response()->json(Payment::with('ticket')->get());
    }
}
