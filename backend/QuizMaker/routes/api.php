<?php

use App\Http\Controllers\Api\QuestionController;
use GuzzleHttp\Psr7\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/ping', function () {
    return response()->json(['message' => 'pong']);
});

Route::get('/questions', [QuestionController::class, 'index']);