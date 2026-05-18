<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UpdateLastSeen
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check()) {
            $user = auth()->user();
            // Update only if last update was more than 1 minute ago to save DB performance
            if (!$user->last_login_at || $user->last_login_at->diffInMinutes(now()) >= 1) {
                $user->update(['last_login_at' => now()]);
            }
        }
        return $next($request);
    }
}
