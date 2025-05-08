<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Question;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

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

    public function exportAndSend(Request $request)
    {
        try {
            $images = $request->input('images'); // 🖼️ مصفوفة base64
            if (!$images || !is_array($images)) {
                return response()->json(['message' => '❌ لم يتم إرسال أي صور'], 400);
            }
    
            // 💡 أنشئ HTML يحتوي كل صورة في صفحة منفصلة
            $html = '<html><head><style>img { max-width: 100%; height: auto; display: block; margin: auto; page-break-after: always; }</style></head><body>';
    
            foreach ($images as $base64Image) {
                $html .= "<div><img src=\"$base64Image\" /></div>";
            }
    
            $html .= '</body></html>';
    
            // 🧾 إنشاء PDF من الـ HTML
            $pdf = Pdf::loadHTML($html)->setPaper('a4');
    
            $pdfFileName = 'questions_export_' . time() . '.pdf';
            $pdfFullPath = storage_path('app/private/pdf/' . $pdfFileName);
    
            if (!file_exists(dirname($pdfFullPath))) {
                mkdir(dirname($pdfFullPath), 0755, true);
            }
    
            file_put_contents($pdfFullPath, $pdf->output());
    
            // ✉️ إرسال الملف بالإيميل
            Mail::send([], [], function ($message) use ($pdfFullPath) {
                $message->to('mansuor1396@gmail.com')
                        ->subject('📚 ملف أسئلة PDF')
                        ->attach($pdfFullPath);
            });
    
            return response()->json(['message' => '✅ تم إرسال ملف الأسئلة عبر البريد الإلكتروني']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => '❌ حدث خطأ أثناء إرسال الملف',
                'error' => $e->getMessage(),
            ], 500);
        }
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

            // ✨ لو في صورة Base64 في السؤال
            if (preg_match_all('/<file.+?name="(.+?)".+?encoding="base64">(.+?)<\/file>/s', $q->questiontext->asXML(), $matches, PREG_SET_ORDER)) {
                foreach ($matches as $match) {
                    $imageName = $match[1];
                    $base64Data = $match[2];

                    // المسار الحقيقي لحفظ الصور داخل مشروع الريأكت
                    $reactImagesPath = '/home/alamthal/public_html/quiz/images/';

                    // تأكد الفولدر موجود
                    if (!file_exists($reactImagesPath)) {
                        mkdir($reactImagesPath, 0755, true);
                    }

                    // احفظ الصورة
                    $imageFullPath = $reactImagesPath . '/' . $imageName;

                if (!file_exists($imageFullPath)) {
                    file_put_contents($imageFullPath, base64_decode($base64Data));
                }


                    // استبدل @@PLUGINFILE@@ بمسار الصورة الصحيح داخل السؤال
                    $questionHtml = str_replace('@@PLUGINFILE@@/' . $imageName, '/quiz/images/' . $imageName, $questionHtml);
                }
            }

            // ✨ إنشاء السؤال
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
