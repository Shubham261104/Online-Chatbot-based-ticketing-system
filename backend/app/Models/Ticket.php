<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    protected $fillable = [
        'visitor_name',
        'visitor_email',
        'event_name',
        'date',
        'time_slot',
        'adults',
        'children',
        'students',
        'females',
        'seniors',
        'foreigners',
        'total_price',
        'status',
        'cancellation_reason',
        'qr_code',
        'razorpay_order_id',
        'razorpay_payment_id',
        'user_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
