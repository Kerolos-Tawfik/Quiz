<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Answer;
use App\Models\Question;
class ImportXmlQuestions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import:xml-questions';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $xmlPath = storage_path('app/data/الأسئلة-101-الأسس-14461013-1755.xml');
        $xml = simplexml_load_file($xmlPath);
    
        $currentCategory = 'غير مصنف';
    
        foreach ($xml->question as $q) {
            $type = (string)$q['type'];
    
            // لو نوع السؤال تصنيف، خزنه للتالي
            if ($type === 'category') {
                if (isset($q->category->text)) {
                    $fullCategory = (string)$q->category->text;
                    // خد آخر جزء بعد آخر /
                    $parts = explode('/', $fullCategory);
                    $currentCategory = trim(end($parts)); // مثلاً: الجذور
                }
                continue;
            }
    
            // نكمل بس على أسئلة الاختيار من متعدد
            if ($type !== 'multichoice') continue;
    
            // بيانات السؤال
            $title = isset($q->name->text) ? (string)$q->name->text : 'بدون عنوان';
            $questionHtml = isset($q->questiontext->text) ? (string)$q->questiontext->text : 'لا يوجد محتوى';
    
            // إنشاء السؤال
            $question = Question::create([
                'title' => $title,
                'content' => $questionHtml,
                'category' => $currentCategory,
            ]);
    
            // الإجابات
            foreach ($q->answer as $ans) {
                $answerText = (string) $ans->text;
                $isCorrect = ((string) $ans['fraction']) === '100';
    
                $question->answers()->create([
                    'text' => $answerText,
                    'is_correct' => $isCorrect,
                ]);
            }
        }
    
        $this->info('✅ تم استيراد الأسئلة بنجاح');
    }
}