<?php

namespace App\Http\Controllers;

use App\Models\ChatLog;
use Illuminate\Http\Request;

class ChatbotController extends Controller
{
    public function message(Request $request)
    {
        $request->validate([
            'message' => 'required|string'
        ]);

        $text = strtolower($request->message);
        $reply = $this->getResponse($text);

        // Store user message
        ChatLog::create([
            'user_id' => auth()->id(),
            'message' => $request->message,
            'sender' => 'user'
        ]);

        // Store bot reply
        ChatLog::create([
            'user_id' => auth()->id(),
            'message' => $reply,
            'sender' => 'bot'
        ]);

        return response()->json([
            'reply' => $reply
        ]);
    }

    private function getResponse($text)
    {
        // Simple Rule-based / NLP search
        if (str_contains($text, 'hello') || str_contains($text, 'hi') || str_contains($text, 'नमस्ते')) {
            return "Hello! I am your Museum AI Assistant. You can ask me about ticket prices, museum timings, or book a ticket. How can I help you today?";
        }

        if (str_contains($text, 'price') || str_contains($text, 'ticket') || str_contains($text, 'टिकट')) {
            return "Museum entry tickets are: ₹500 for Adults, ₹250 for children (5-12 years), and ₹200 for students with valid ID. Children under 5 enter for free.";
        }

        if (str_contains($text, 'timing') || str_contains($text, 'time') || str_contains($text, 'समय')) {
            return "The museum is open daily from 9:00 AM to 6:00 PM. Last entry is at 5:00 PM.";
        }

        if (str_contains($text, 'book') || str_contains($text, 'buy')) {
            return "You can book tickets directly from our 'Book Tickets' page or tell me the date and number of visitors here!";
        }

        if (str_contains($text, 'location') || str_contains($text, 'where') || str_contains($text, 'pata') || str_contains($text, 'pata')) {
            return "We are located at Central Park, Heritage District, New Delhi. The nearest metro station is Heritage Park (Line 2).";
        }

        return "I apologize, but I didn't quite catch that. You can ask about 'prices', 'timings', or 'how to book'.";
    }
}
