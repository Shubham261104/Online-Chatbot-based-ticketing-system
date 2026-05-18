<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SupportTicket;

class SupportController extends Controller
{
    /**
     * Submit a support / feedback ticket (public or authenticated users).
     */
    public function store(Request $request)
    {
        $request->validate([
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'user_name'  => 'nullable|string|max:255',
            'user_email' => 'nullable|email|max:255',
        ]);

        $authUser = auth('api')->user();

        $ticket = SupportTicket::create([
            'user_id'    => $authUser ? $authUser->id : null,
            'user_name'  => $authUser ? $authUser->name  : $request->user_name,
            'user_email' => $authUser ? $authUser->email : $request->user_email,
            'subject'    => $request->subject,
            'message'    => $request->message,
            'status'     => 'open',
        ]);

        return response()->json([
            'message' => 'Support ticket submitted successfully',
            'ticket'  => $ticket
        ], 201);
    }

    /**
     * List all support tickets – Admin only.
     */
    public function index()
    {
        $tickets = SupportTicket::latest()->get();
        return response()->json($tickets);
    }

    /**
     * Update status and/or add an admin reply – Admin only.
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status'      => 'required|in:open,in_progress,resolved,closed',
            'admin_reply' => 'nullable|string',
        ]);

        $ticket = SupportTicket::findOrFail($id);
        $ticket->update([
            'status'      => $request->status,
            'admin_reply' => $request->admin_reply,
        ]);

        return response()->json([
            'message' => 'Support ticket updated successfully',
            'ticket'  => $ticket
        ]);
    }

    /**
     * Delete a support ticket – Admin only.
     */
    public function destroy($id)
    {
        $ticket = SupportTicket::findOrFail($id);
        $ticket->delete();
        return response()->json(['message' => 'Ticket deleted successfully']);
    }
}
