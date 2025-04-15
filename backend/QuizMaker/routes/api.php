<?php

use App\Http\Controllers\Api\QuestionController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\StudentInfoController;
use App\Models\Question;
use Illuminate\Support\Facades\Route;

Route::get('/ping', function () {
    return response()->json(['message' => 'pong']);
});

Route::get('/questions', [QuestionController::class, 'index']);
Route::post('/students', [StudentInfoController::class, 'store']);
Route::post('/settings', [SettingController::class, 'store']);
Route::get('/settings', [SettingController::class, 'index']);
Route::get('/students', [StudentInfoController::class, 'index']); // لعرض النتائج
Route::get('/categories', function () {
    $categories = Question::select('category')->distinct()->pluck('category');
    return response()->json($categories);
});