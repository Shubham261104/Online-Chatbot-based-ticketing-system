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
            $language = $request->input('language', 'English');
            $reply = $this->getAIResponse($request->message, $language);
        }

        ChatLog::create([
            'user_id' => auth('api')->id() ?? null,
            'message' => $request->message,
            'sender' => 'user'
        ]);

        ChatLog::create([
            'user_id' => auth('api')->id() ?? null,
            'message' => $reply,
            'sender' => 'bot'
        ]);

        $responseData = [
            'reply' => $reply
        ];

        if (str_contains($text, 'guide') || str_contains($text, 'map') || str_contains($text, 'explore')) {
            $responseData['attachment'] = [
                'name' => 'National_Museum_Visitor_Guide.pdf',
                'url' => '#',
                'size' => '2.4 MB'
            ];
        }

        return response()->json($responseData);
    }

    /**
     * Step 1: Predefined Fast FAQ Logic
     */
    private function getLocalResponse($text)
    {
        $faqs = [
            'price' => [
                'keywords' => ['price', 'ticket', 'cost', 'fee', 'charge', 'amount', 'paise', 'rupees', 'टिकट', 'discount', 'student', 'concession', 'offer'],
                'reply' => "🎟️ Ticket Prices & Discounts:\n• Adult: ₹500\n• Child (5-12): ₹250\n• Student: ₹200 (Requires valid ID) 🎉\n• Senior Citizen: ₹350\n• Below 5: FREE"
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
            'guide' => [
                'keywords' => ['guide', 'visitor guide', 'map', 'tour', 'explore', 'what to see', 'attractions'],
                'reply' => "🏛️ **Comprehensive Visitor Guide & Highlights:**\n\n**📍 Gallery Layout:**\n• **Ground Floor**: Reception desk, Cloakroom, Souvenir Emporium, and Garden Cafeteria.\n• **Level 1 (Ancient Era)**: Harappan Civilization artifacts, Buddhist Art Collection, and Maurya & Gupta sculptures.\n• **Level 2 (Medieval & Royal)**: Mughal Miniature Paintings, Rajput Armoury & Weapons, and Tanjore paintings.\n• **Level 3 (Modern & Interactive)**: Contemporary Indian Paintings, Science & Technology Pavilion, and Open-air Deck.\n\n**✨ Top Must-See Artifacts:**\n• *Dancing Girl of Mohenjo-daro* (Indus Valley Gallery)\n• *The Veiled Rebecca* (Salar Jung Collection)\n• *Ashokan Pillar Capital* (Sculpture Court)\n• *The 4,000-year-old Mummy Exhibit* (Egyptian Gallery)\n\n**🎧 Visitor Amenities:**\n• **Audio Guides**: Available at reception in English, Hindi, French, Spanish, and German (₹150 per device).\n• **Photography**: Allowed with smartphones for personal use (No flash/tripods).\n• **Accessibility**: Wheelchairs and elevators are available on all floors free of charge."
            ],
            'history' => [
                'keywords' => ['history', 'conversations', 'recent conversations', 'past'],
                'reply' => "You can view all your recent conversations with me in the 'Recent History' section on the left sidebar! Let me know if you need help with anything else."
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
    private function getAIResponse($userMessage, $language = 'English')
    {
        $apiKey = env('OPENAI_API_KEY');
        
        if (!$apiKey) {
            return "I apologize, but I'm currently in basic mode. You can ask me about prices, timings, or location. For more complex help, please check our help section.";
        }

        $messages = [
            ['role' => 'system', 'content' => "You are a helpful and professional AI Assistant for the National Heritage Museum. Keep answers polite and museum-focused. Always reply in {$language}."],
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

    public function getHistory()
    {
        $logs = ChatLog::where('user_id', auth('api')->id())
            ->latest()
            ->take(50)
            ->get()
            ->reverse()
            ->values();

        return response()->json($logs);
    }

    public function clearHistory()
    {
        ChatLog::where('user_id', auth('api')->id())->delete();
        return response()->json(['message' => 'History cleared successfully']);
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
