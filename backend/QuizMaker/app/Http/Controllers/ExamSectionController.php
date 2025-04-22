<?php
namespace App\Http\Controllers;

use App\Models\ExamSection;
use Illuminate\Http\Request;

class ExamSectionController extends Controller
{
    // جلب كل الأقسام
    public function index()
    {
        return ExamSection::all();
    }

    // حفظ أو تحديث الأقسام (bulk update)
    public function store(Request $request)
    {
        // حذف القديم لو عايز تعمل reset دايمًا
        ExamSection::truncate();

        foreach ($request->sections as $section) {
            ExamSection::create([
                'name' => $section['name'],
                'duration' => $section['duration'],
                'questions_per_bank' => $section['questionsPerBank']
            ]);
        }

        return response()->json(['message' => 'تم حفظ الأقسام بنجاح']);
    }
}
