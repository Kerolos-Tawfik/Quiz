<?php

namespace App\Http\Controllers;

use App\Mail\coustmMail;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class coustmMailController extends Controller
{
    public function sendMail(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'name' => 'required|string',
                'phone' => 'required|string',
                'correct' => 'required|integer',
                'wrong' => 'required|integer',
                'percentage' => 'required|numeric',
                'sections' => 'required|array',
            ]);

            Mail::to($request->email)->send(new coustmMail(
                $request->name,
                $request->phone,
                $request->correct,
                $request->wrong,
                $request->percentage,
                $request->sections
            ));

            return response()->json(['message' => '📧 تم إرسال النتيجة بنجاح']);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => '❌ فشل في إرسال النتيجة',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
