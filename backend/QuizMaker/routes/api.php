<?php

use App\Http\Controllers\Api\QuestionController;
use App\Http\Controllers\Auth\EmailVerificationController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\coustmMailController;
use App\Http\Controllers\ExamSectionController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\StudentInfoController;
use App\Mail\coustmMail;
use App\Models\Question;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

Route::get('/ping', function () {
    return response()->json(['message' => 'pong']);
});

Route::get('/questions', [QuestionController::class, 'index']);
Route::post('/students', [StudentInfoController::class, 'store']);
Route::delete('/students/{id}', [StudentInfoController::class, 'destroy']);
Route::get('/students', [StudentInfoController::class, 'index']);
Route::post('/settings', [SettingController::class, 'store']);
Route::get('/settings', [ExamSectionController::class, 'index']);
Route::post('/settings', [ExamSectionController::class, 'store']);
Route::get('/categories-with-notes', function () {
    $categories = Question::select('category', DB::raw('MAX(note) as note'))
        ->groupBy('category')
        ->get()
        ->map(function ($item) {
            return [
                'name' => $item->category,
                'note' => $item->note ?? '',
            ];
        });

    return response()->json($categories);
});
Route::post('/question-bank/update-note', function (\Illuminate\Http\Request $request) {
    $request->validate([
        'category' => 'required|string',
        'note' => 'nullable|string',
    ]);

    \App\Models\Question::where('category', $request->category)
        ->update(['note' => $request->note]);

    return response()->json(['message' => 'تم تحديث الملاحظة بنجاح']);
});

Route::get('/category-questions-count', function () {
    return \App\Models\Question::selectRaw('category, COUNT(*) as total')
        ->groupBy('category')
        ->pluck('total', 'category');
});
Route::post('/admin-login', [AuthController::class, 'login']);
Route::post('/question-bank/import', [QuestionController::class, 'import']);
Route::delete('/question-bank/{category}', [QuestionController::class, 'destroy']);
Route::put('/students/{id}', [StudentInfoController::class, 'update']);
Route::delete('/students/del/all', [StudentInfoController::class, 'destroyAll']);
Route::post('/email/send-code', [EmailVerificationController::class, 'sendCode']);
Route::post('/email/verify-code', [EmailVerificationController::class, 'verifyCode']);
Route::post('/email/sendMail', [coustmMailController::class, 'sendMail']);