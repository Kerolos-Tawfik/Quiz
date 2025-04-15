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
        $xmlPath = storage_path('app/data/الأسئلة-101-الجذور-14461013-1759.xml');
        $xml = simplexml_load_file($xmlPath);
        foreach ($xml->question as $q) {
            if ((string)$q['type'] !== 'multichoice') continue;
        
            $title = (string) $q->name->text ?? null;
            $questionHtml = (string) $q->questiontext->text;
        
            // إنشاء السؤال
            $question = Question::create([
                'title' => $title,
                'content' => $questionHtml,
            ]);
        
            // إنشاء الإجابات المرتبطة
            foreach ($q->answer as $ans) {
                $answerText = (string) $ans->text;
                $isCorrect = ((string) $ans['fraction']) === '100';
        
                $question->answers()->create([
                    'text' => $answerText,
                    'is_correct' => $isCorrect,
                ]);
            }
        }
        
    
        $this->info('تم استيراد الأسئلة بنجاح ✅');
    }
    
}
