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
        
        // 1. Check Local Knowledge Base (Hybrid System)
        $reply = $this->getLocalResponse($text);

        // 2. Fallback to AI (OpenAI) if no local match
        if (!$reply) {
            $reply = $this->getAIResponse($request->message);
        }

        /* 
        ChatLog::create([
            'user_id' => auth()->check() ? auth()->id() : null,
            'message' => $request->message,
            'sender' => 'user'
        ]);

        ChatLog::create([
            'user_id' => auth()->check() ? auth()->id() : null,
            'message' => $reply,
            'sender' => 'bot'
        ]);
        */

        return response()->json([
            'reply' => $reply
        ]);
    }

    /**
     * Step 1: Predefined Fast FAQ Logic
     */
    private function getLocalResponse($text)
    {
        $faqs = [
            'price' => [
                'keywords' => ['price', 'ticket', 'cost', 'fee', 'charge', 'amount', 'paise', 'rupees', 'टिकट'],
                'reply' => "🎟️ Ticket Prices:\n• Adult: ₹500\n• Child (5-12): ₹250\n• Student: ₹200 (with ID)\n• Below 5: FREE"
            ],
            'timing' => [
                'keywords' => ['timing', 'time', 'open', 'close', 'hour', 'when', 'schedule', 'monday', 'समय'],
                'reply' => "🕒 Opening Hours:\nTue - Sun: 9 AM - 6 PM\n🚫 Monday: CLOSED\nLast entry: 5 PM."
            ],
            'booking' => [
                'keywords' => ['book', 'buy', 'purchase', 'reserve', 'confirmation', 'get ticket', 'टिकट बुक'],
                'reply' => "You can book tickets easily on our 'Book Tickets' page! 📱 Select your date and visitors to get an instant QR ticket."
            ],
            'location' => [
                'keywords' => ['location', 'where', 'place', 'address', 'reach', 'map', 'direction', 'pata', 'पता'],
                'reply' => "📍 Location: Central Heritage Park, Gate 2, New Delhi.\n🚇 Metro: Heritage Park Station (Yellow Line)."
            ],
        ];

        // First check for exact word matches
        foreach ($faqs as $faq) {
            if ($this->containsAny($text, $faq['keywords'])) {
                return $faq['reply'];
            }
        }

        // Fuzzy matching fallback (Levenshtein)
        foreach ($faqs as $faq) {
            foreach ($faq['keywords'] as $keyword) {
                if (levenshtein($text, $keyword) <= 2) { // Allow 2 characters difference
                    return $faq['reply'];
                }
            }
        }

        return null;
    }

    /**
     * Step 2: OpenAI Fallback for Intelligent Conversations
     */
    private function getAIResponse($userMessage)
    {
        $apiKey = env('OPENAI_API_KEY');
        
        if (!$apiKey) {
            return "I apologize, but I'm currently in basic mode. You can ask me about prices, timings, or location. For more complex help, please check our help section.";
        }

        /*
        // Fetch last 5 messages for context
        $history = ChatLog::where('user_id', auth()->id())
            ->latest()
            ->take(5)
            ->get()
            ->reverse();

        $messages = [
            ['role' => 'system', 'content' => 'You are a helpful and professional AI Assistant for the National Heritage Museum. Keep answers polite and museum-focused. Support both English and Hindi. Use previous context if available.']
        ];

        foreach ($history as $log) {
            $messages[] = ['role' => $log->sender === 'bot' ? 'assistant' : 'user', 'content' => $log->message];
        }

        $messages[] = ['role' => 'user', 'content' => $userMessage];
        */

        $messages = [
            ['role' => 'system', 'content' => 'You are a helpful and professional AI Assistant for the National Heritage Museum. Keep answers polite and museum-focused. Support both English and Hindi.'],
            ['role' => 'user', 'content' => $userMessage]
        ];

        try {
            $response = \Illuminate\Support\Facades\Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ])->post('https://api.openai.com/v1/chat/completions', [
                'model' => 'gpt-3.5-turbo',
                'messages' => $messages,
                'max_tokens' => 200
            ]);

            if ($response->successful()) {
                return $response->json()['choices'][0]['message']['content'];
            }
            
            return "I'm having a small connection issue with my AI brain. How else can I help with museum info?";
        } catch (\Exception $e) {
            return "I understand your query but I'm unable to reach my advanced logic right now. Try asking about 'ticket prices' or 'timings'!";
        }
    }

    private function containsAny($text, $array)
    {
        foreach ($array as $word) {
            if (str_contains($text, $word)) {
                return true;
            }
        }
        return false;
    }
}
