<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\PaymentController;

// Public auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public booking & payment (no login required)
Route::get('/slots', [TicketController::class, 'getSlots']);
Route::post('/book-ticket', [TicketController::class, 'book']);
Route::post('/payment', [PaymentController::class, 'store']);
Route::post('/chatbot', [ChatbotController::class, 'message']);

// Protected routes (require JWT)
Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/tickets', [TicketController::class, 'userHistory']);
});

// Admin APIs
Route::get('/admin/tickets', [TicketController::class, 'allTickets']);
Route::get('/admin/payments', [PaymentController::class, 'getPayments']);
