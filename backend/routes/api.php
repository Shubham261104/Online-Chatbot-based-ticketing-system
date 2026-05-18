<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\SupportController;

// Public auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/google-register', [AuthController::class, 'googleRegister']);

// Public booking & payment (no login required)
Route::get('/slots', [TicketController::class, 'getSlots']);
Route::post('/book-ticket', [TicketController::class, 'book']);
Route::post('/payment', [PaymentController::class, 'store']);
Route::post('/chatbot', [ChatbotController::class, 'message']);
Route::post('/verify-payment', [TicketController::class, 'verifyPayment']);
Route::post('/support', [SupportController::class, 'store']);

// Protected routes (require JWT)
Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/update-profile', [AuthController::class, 'updateProfile']);
    Route::get('/tickets', [TicketController::class, 'userHistory']);
    Route::post('/tickets/{id}/cancel', [TicketController::class, 'cancel']);
    Route::get('/chatbot/history', [ChatbotController::class, 'getHistory']);
});

// Admin APIs
Route::get('/admin/stats', [TicketController::class, 'getAdminStats']);
Route::get('/admin/tickets', [TicketController::class, 'allTickets']);
Route::get('/admin/users', [TicketController::class, 'getUsers']);
Route::post('/admin/users', [TicketController::class, 'createUser']);
Route::delete('/admin/users/{id}', [TicketController::class, 'deleteUser']);
Route::post('/admin/users/{id}/block', [TicketController::class, 'blockUser']);
Route::post('/admin/users/{id}/unblock', [TicketController::class, 'unblockUser']);
Route::get('/admin/chat-logs', [TicketController::class, 'getChatLogs']);
Route::post('/admin/notifications', [NotificationController::class, 'send']);
Route::get('/admin/settings', [TicketController::class, 'getSettings']);
Route::post('/admin/settings', [TicketController::class, 'updateSettings']);
Route::get('/admin/notifications/history', [NotificationController::class, 'history']);
Route::get('/admin/slots', [TicketController::class, 'getAdminSeating']);
Route::post('/admin/slots/bulk-update', [TicketController::class, 'bulkUpdateSlots']);
Route::get('/admin/support', [SupportController::class, 'index']);
Route::post('/admin/support/{id}/update', [SupportController::class, 'updateStatus']);
Route::delete('/admin/support/{id}', [SupportController::class, 'destroy']);


Route::middleware('auth:api')->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
});
