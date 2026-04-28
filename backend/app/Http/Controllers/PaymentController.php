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
            // Optionally generate QR code here too
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
