<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    protected $fillable = [
        'visitor_name',
        'visitor_email',
        'date',
        'time_slot',
        'adults',
        'children',
        'total_price',
        'status',
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
