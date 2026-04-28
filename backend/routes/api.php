<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\PaymentController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Ticket Booking
    Route::post('/book-ticket', [TicketController::class, 'book']);
    Route::get('/tickets', [TicketController::class, 'userHistory']);
    
    // Payments
    Route::post('/payment', [PaymentController::class, 'store']);
    
    // Chatbot (Protected to log user_id)
    Route::post('/chatbot', [ChatbotController::class, 'message']);
});

// Admin APIs
Route::get('/admin/tickets', [TicketController::class, 'allTickets']);
Route::get('/admin/payments', [PaymentController::class, 'getPayments']);
