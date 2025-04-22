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
    public function import(Request $request)
{
    try {
        $request->validate([
            'xml_file' => 'required|file|mimes:xml',
        ]);

        $file = $request->file('xml_file');
        $tmpPath = $file->getRealPath();
        $xml = simplexml_load_file($tmpPath);
        
        $currentCategory = 'غير مصنف';

        foreach ($xml->question as $q) {
            $type = (string)$q['type'];

            if ($type === 'category' && isset($q->category->text)) {
                $parts = explode('/', (string)$q->category->text);
                $currentCategory = trim(end($parts));
                continue;
            }

            if ($type !== 'multichoice') continue;

            $title = (string)($q->name->text ?? 'بدون عنوان');
            $questionHtml = (string)($q->questiontext->text ?? 'لا يوجد محتوى');

            $question = Question::create([
                'title' => $title,
                'content' => $questionHtml,
                'category' => $currentCategory,
            ]);

            foreach ($q->answer as $ans) {
                $question->answers()->create([
                    'text' => (string)$ans->text,
                    'is_correct' => ((string)$ans['fraction']) === '100',
                ]);
            }
        }

        return response()->json(['message' => '✅ تم استيراد الأسئلة بنجاح']);
    } catch (\Exception $e) {
        return response()->json([
            'message' => '❌ فشل في استيراد الأسئلة',
            'error' => $e->getMessage(),
        ], 500);
    }
}

    public function destroy($category)
    {
        $deleted = Question::where('category', $category)->delete();
    
        return response()->json([
            'message' => "تم حذف $deleted سؤال من تصنيف $category"
        ], 200);
    }

    
}
