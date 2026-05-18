<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Mail\WelcomeEmail;
use Illuminate\Validation\Rules\Password;


use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => [
                'required',
                'string',
                Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
                    ->symbols(),
            ],
        ]);


        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'user'
        ]);

        // Send Welcome Email
        try {
            Mail::to($user->email)->send(new WelcomeEmail($user));
        } catch (\Exception $e) {
            // Log error but don't fail registration
            \Log::error('Failed to send welcome email: ' . $e->getMessage());
        }


        $token = JWTAuth::fromUser($user);

        return response()->json([
            'user' => $user,
            'token' => $token
        ], 201);
    }

    public function googleRegister(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
        ]);

        // Check if user exists
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make(Str::random(16)), // Random password for google users
                'role' => 'user'
            ]);

            // Send Welcome Email
            try {
                Mail::to($user->email)->send(new WelcomeEmail($user));
            } catch (\Exception $e) {
                \Log::error('Failed to send welcome email (Google): ' . $e->getMessage());
            }
        }

        if ($user->status === 'blocked') {
            return response()->json([
                'error' => 'Your account has been blocked.',
                'reason' => $user->block_reason
            ], 403);
        }

        $token = JWTAuth::fromUser($user);

        // Update last login
        $user->update(['last_login_at' => now()]);

        return response()->json([
            'user' => $user,
            'token' => $token
        ], 200);
    }


    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $user = auth()->user();

        if ($user->status === 'blocked') {
            auth()->logout();
            return response()->json([
                'error' => 'Your account has been blocked.',
                'reason' => $user->block_reason
            ], 403);
        }

        $user->update(['last_login_at' => now()]);

        return response()->json([
            'user' => $user,
            'token' => $token
        ]);
    }

    public function logout()
    {
        auth()->logout();
        return response()->json(['message' => 'Successfully logged out']);
    }

    public function me()
    {
        $user = auth()->user();
        
        $totalVisits = \App\Models\Ticket::where('user_id', $user->id)
                                         ->where('status', 'paid')
                                         ->count();
                                         
        $rewardPoints = $totalVisits * 50; // 50 points per visit
        
        $user->total_visits = $totalVisits;
        $user->reward_points = $rewardPoints;
        
        return response()->json($user);
    }

    public function updateProfile(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'nullable|string|max:20',
            'location' => 'nullable|string|max:255',
            'profile_picture' => 'nullable|string'
        ]);

        if ($request->has('name')) $user->name = $request->name;
        if ($request->has('phone')) $user->phone = $request->phone;
        if ($request->has('location')) $user->location = $request->location;
        if ($request->has('profile_picture')) $user->profile_picture = $request->profile_picture;

        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }
}
