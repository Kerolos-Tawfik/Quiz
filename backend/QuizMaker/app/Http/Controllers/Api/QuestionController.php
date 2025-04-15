<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Question;

class QuestionController extends Controller
{
    public function index()
    {
        $questions = Question::with('answers')->get();
    
        return response()->json([
            'status' => 'success',
            'data' => $questions
        ]);
    }
    
}
