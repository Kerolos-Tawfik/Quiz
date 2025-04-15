<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Question;
use App\Models\studentinfo;
use Illuminate\Http\Request;

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
