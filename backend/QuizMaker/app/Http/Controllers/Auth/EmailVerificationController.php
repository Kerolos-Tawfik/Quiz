<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\EmailVerificationCode;
use App\Models\EmailVerification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class EmailVerificationController extends Controller
{


    public function sendCode(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'name'=>'required'
            ]);
    
            $code = random_int(1000, 9999);
            $name  = $request->name;
            EmailVerification::updateOrCreate(
                ['email' => $request->email],
                [
                    'code' => $code,
                    'expires_at' => now()->addMinutes(10),
                ]
            );
    
            Mail::to($request->email)->send(new EmailVerificationCode($code , $name));
    
            return response()->json(['message' => 'تم إرسال الكود بنجاح']);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'فشل في تنفيذ الطلب',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    

    public function verifyCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string',
        ]);

        $record = EmailVerification::where('email', $request->email)
            ->where('code', $request->code)
            ->where('expires_at', '>', now())
            ->first();

        if (!$record) {
            return response()->json(['message' => 'رمز غير صالح أو منتهي الصلاحية'], 422);
        }

        $record->delete();

        return response()->json(['message' => 'تم التحقق من البريد الإلكتروني بنجاح.']);
    }
}
