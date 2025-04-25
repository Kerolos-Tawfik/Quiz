<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class studentinfo extends Model
{
    protected $table = 'studentinfos'; // لازم يكون ده نفس اسم الجدول في قاعدة البيانات

    protected $fillable = ['name', 'phone', 'score', 'percentage','email'];
}
