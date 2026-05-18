<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    // Admin: Send notification
    public function send(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'message' => 'required|string',
            'type' => 'required|string',
            'target' => 'required|string', // 'all' or specific user_id
        ]);

        if ($request->target === 'all') {
            Notification::create([
                'title' => $request->title,
                'message' => $request->message,
                'type' => $request->type,
                'user_id' => null // Broadcast
            ]);
        } else {
            Notification::create([
                'title' => $request->title,
                'message' => $request->message,
                'type' => $request->type,
                'user_id' => $request->target
            ]);
        }

        return response()->json(['message' => 'Notification sent successfully']);
    }

    // Admin: Get notification history
    public function history()
    {
        $notifications = Notification::with('user')->latest()->get();
        $totalUsers = User::where('status', 'active')->count();

        $notifications = $notifications->map(function ($notif) use ($totalUsers) {
            $reach = is_null($notif->user_id) ? $totalUsers : 1;
            $notif->reach = $reach;
            return $notif;
        });

        return response()->json($notifications);
    }

    // User: Fetch notifications
    public function index()
    {
        $userId = auth()->id();
        $notifications = Notification::where('user_id', $userId)
            ->orWhereNull('user_id')
            ->latest()
            ->take(20)
            ->get();
        
        return response()->json($notifications);
    }

    // User: Mark as read
    public function markAsRead($id)
    {
        $notification = Notification::find($id);
        if ($notification && ($notification->user_id == auth()->id() || is_null($notification->user_id))) {
            $notification->update(['is_read' => true]);
        }
        return response()->json(['message' => 'Marked as read']);
    }
}
