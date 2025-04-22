<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExamSection extends Model
{
    protected $fillable = ['name', 'duration', 'questions_per_bank'];

    protected $casts = [
        'questions_per_bank' => 'array', // Laravel يحولها تلقائياً من/إلى JSON
    ];
}

