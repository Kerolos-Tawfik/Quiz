<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmailVerification extends Model
{
    protected $fillable = ['email', 'code', 'expires_at'];

    // لو بتحب تضيف حماية من التواريخ تلقائيًا
    public $timestamps = true;

    // ممكن تضيف cast للـ expires_at عشان يكون DateTime تلقائيًا
    protected $casts = [
        'expires_at' => 'datetime',
    ];
}
