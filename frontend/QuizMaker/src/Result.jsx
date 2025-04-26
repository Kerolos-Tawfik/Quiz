import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';

const Result = ({ questions, userAnswers, onRestart, student }) => {
  const done = useRef(false);
  const [showReview, setShowReview] = useState(false);

  // عدد الإجابات الصحيحة
  const correctCount = questions.reduce((count, question) => {
    const selectedIndex = userAnswers[question.id];
    const isCorrect = question.answers[selectedIndex]?.is_correct == 1;
    return isCorrect ? count + 1 : count;
  }, 0);

  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);
    }
  }, [showReview]);

  const total = questions.length;
  const wrongCount = total - correctCount;
  const percentage = ((correctCount / total) * 100).toFixed(1);

  const verbalBanksList = [
    'الخطأ السياقي',
    'إكمال الجمل',
    'الكلمة الشاذة',
    'استيعاب المقروء'
  ];

  const quantBanksList = [
    'الأعداد وخصائصها',
    'قابلية القسمة',
    'الأعداد العشرة',
    'الكسور',
    'النسبة',
    'التناسب',
    'النسبة المئوية',
    'المتوسط',
    'مسائل حسابية',
    'الزوايا والمستقيمات',
    'المثلث',
    'الرباعي',
    'الدائرة',
    'الاشكال المركبة',
    'الهندسة الإحداثية',
    'المجسمات',
    'الرسوم البيانية',
    'الاحتمالات',
    'منوعات',
    'المتطابقات',
    'المقادير الجبرية',
    'المعادلات والمتباينات',
    'الأسس',
    'الجذور',
    'المسائل اللفظية',
    'النمط'
  ];

  // دالة تطابق ذكي
// مكان normalize الأديم
const normalizeArabic = (text) => {
  return text
    ?.toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[أإآء]/g, 'ا')
    .replace(/[ة]/g, 'ه')
    .replace(/[ًٌٍَُِّ]/g, '');
};

const isSimilarName = (name, list) => {
  const normalizedName = normalizeArabic(name);
  return list.some(original => normalizeArabic(original) === normalizedName);
};

  const bankSummary = {};

  questions.forEach((question) => {
    const bankName = question.category || 'بنك غير معروف';
    const selectedIndex = userAnswers[question.id];
    const isCorrect = question.answers[selectedIndex]?.is_correct == 1;

    if (!bankSummary[bankName]) {
      bankSummary[bankName] = { correct: 0, wrong: 0 };
    }

    if (isCorrect) {
      bankSummary[bankName].correct += 1;
    } else {
      bankSummary[bankName].wrong += 1;
    }
  });

  const sectionsArray = [
    {
      title: '📘 القسم اللفظي',
      banks: Object.entries(bankSummary)
        .filter(([bankName, data]) =>
          isSimilarName(bankName, verbalBanksList) && (data.correct > 0 || data.wrong > 0)
        )
        .map(([bankName, data]) => ({
          name: bankName,
          score: data.correct,
          correct: data.correct,
          wrong: data.wrong
        })),
    },
    {
      title: '📗 القسم الكمي',
      banks: [
        {
          name: 'الحساب',
          score: Object.entries(bankSummary)
            .filter(([bankName]) => [
              'الأعداد وخصائصها', 'قابلية القسمة', 'الأعداد العشرية', 'الكسور',
              'النسبة', 'التناسب', 'النسبة المئوية', 'المتوسط', 'مسائل حسابية', 'منوعات حسابية'
            ].some(sub => isSimilarName(bankName, [sub])))
            .reduce((acc, [, data]) => acc + data.correct, 0),
          correct: Object.entries(bankSummary)
            .filter(([bankName]) => [
              'الأعداد وخصائصها', 'قابلية القسمة', 'الأعداد العشرية', 'الكسور',
              'النسبة', 'التناسب', 'النسبة المئوية', 'المتوسط', 'مسائل حسابية', 'منوعات حسابية'
            ].some(sub => isSimilarName(bankName, [sub])))
            .reduce((acc, [, data]) => acc + data.correct, 0),
          wrong: Object.entries(bankSummary)
            .filter(([bankName]) => [
              'الأعداد وخصائصها', 'قابلية القسمة', 'الأعداد العشرية', 'الكسور',
              'النسبة', 'التناسب', 'النسبة المئوية', 'المتوسط', 'مسائل حسابية', 'منوعات حسابية'
            ].some(sub => isSimilarName(bankName, [sub])))
            .reduce((acc, [, data]) => acc + data.wrong, 0),
        },
        {
          name: 'الهندسة',
          score: Object.entries(bankSummary)
            .filter(([bankName]) => [
              'الزوايا والمستقيمات', 'المثلث', 'الرباعي', 'الدائرة',
              'الاشكال المركبة', 'الهندسة الإحداثية', 'المجسمات', 'منوعات هندسية'
            ].some(sub => isSimilarName(bankName, [sub])))
            .reduce((acc, [, data]) => acc + data.correct, 0),
          correct: Object.entries(bankSummary)
            .filter(([bankName]) => [
              'الزوايا والمستقيمات', 'المثلث', 'الرباعي', 'الدائرة',
              'الاشكال المركبة', 'الهندسة الإحداثية', 'المجسمات', 'منوعات هندسية'
            ].some(sub => isSimilarName(bankName, [sub])))
            .reduce((acc, [, data]) => acc + data.correct, 0),
          wrong: Object.entries(bankSummary)
            .filter(([bankName]) => [
              'الزوايا والمستقيمات', 'المثلث', 'الرباعي', 'الدائرة',
              'الاشكال المركبة', 'الهندسة الإحداثية', 'المجسمات', 'منوعات هندسية'
            ].some(sub => isSimilarName(bankName, [sub])))
            .reduce((acc, [, data]) => acc + data.wrong, 0),
        },
        {
          name: 'تحليل البيانات',
          score: Object.entries(bankSummary)
            .filter(([bankName]) => [
              'الرسوم البيانية', 'الاحتمالات', 'منوعات'
            ].some(sub => isSimilarName(bankName, [sub])))
            .reduce((acc, [, data]) => acc + data.correct, 0),
          correct: Object.entries(bankSummary)
            .filter(([bankName]) => [
              'الرسوم البيانية', 'الاحتمالات', 'منوعات'
            ].some(sub => isSimilarName(bankName, [sub])))
            .reduce((acc, [, data]) => acc + data.correct, 0),
          wrong: Object.entries(bankSummary)
            .filter(([bankName]) => [
              'الرسوم البيانية', 'الاحتمالات', 'منوعات'
            ].some(sub => isSimilarName(bankName, [sub])))
            .reduce((acc, [, data]) => acc + data.wrong, 0),
        },
        {
          name: 'الجبر',
          score: Object.entries(bankSummary)
            .filter(([bankName]) => [
              'المتطابقات', 'المقادير الجبرية', 'المعادلات والمتباينات',
              'الجذور', 'المسائل اللفظية', 'النمط', 'منوعات جبر'
            ].some(sub => isSimilarName(bankName, [sub])))
            .reduce((acc, [, data]) => acc + data.correct, 0),
          correct: Object.entries(bankSummary)
            .filter(([bankName]) => [
              'المتطابقات', 'المقادير الجبرية', 'المعادلات والمتباينات',
              'الجذور', 'المسائل اللفظية', 'النمط', 'منوعات جبر'
            ].some(sub => isSimilarName(bankName, [sub])))
            .reduce((acc, [, data]) => acc + data.correct, 0),
          wrong: Object.entries(bankSummary)
            .filter(([bankName]) => [
              'المتطابقات', 'المقادير الجبرية', 'المعادلات والمتباينات',
              'الجذور', 'المسائل اللفظية', 'النمط', 'منوعات جبر'
            ].some(sub => isSimilarName(bankName, [sub])))
            .reduce((acc, [, data]) => acc + data.wrong, 0),
        }
      ]
    }
  ];
  

  const handleQuizFinish = async () => {
    if (done.current) return;

    try {
      await axios.post(`https://api.alamthal.org/api/students`, {
        name: student.name,
        phone: student.phone,
        email: student.email,
        score: correctCount,
        percentage: percentage,
      });
      console.log(sectionsArray);

      done.current = true;
    } catch (error) {
      console.error(error);
    }
  };

  const sendResultMail = async () => {
    try {
      await axios.post('https://api.alamthal.org/api/email/sendMail', {
        email: student.email,
        name: student.name,
        phone: student.phone,
        correct: correctCount,
        wrong: wrongCount,
        percentage: percentage,
        sections: sectionsArray,
      });
    } catch (err) {
      console.error('❌ فشل في ارسال الدرجات:', err);
    }
  };

  useEffect(() => {
    handleQuizFinish();
    sendResultMail();
  }, []);
  // مراجعة الإجابات
  if (showReview) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 font-[Tajawal] text-right">
        <h1 className="text-3xl font-bold text-yellow-400 mb-6 text-center">📋 مراجعة إجاباتك</h1>
        <div className="space-y-6">
          {questions.map((question) => {
            const selected = userAnswers[question.id];
            const isCorrect = question.answers[selected]?.is_correct == 1;

            return (
              <div
                key={question.id}
                className={`p-4 rounded-lg border ${isCorrect ? 'border-green-500 bg-green-100/10' : 'border-red-500 bg-red-100/10'}`}
              >
                <p className="font-bold mb-2 text-lg" dangerouslySetInnerHTML={{
                  __html: question.content
                    ?.replaceAll('@@PLUGINFILE@@', '/images')
                    ?.replaceAll('<img', '<img style="display:block; margin:auto;"'),
                }} />
                <div className="pl-4 space-y-2">
                  {question.answers.map((a, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded ${
                        i === selected
                          ? a.is_correct == 1
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                          : a.is_correct == 1
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                      dangerouslySetInnerHTML={{ __html: a.text }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => onRestart()}
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 font-bold rounded-lg mt-6"
          >
            🔁 إعادة الاختبار
          </button>
        </div>
      </div>
    );
  }

  // شاشة النتيجة
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-[Tajawal] text-center flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-yellow-400 mb-6">📊 النتيجة النهائية</h1>
      <p className="text-xl mb-2">عدد الأسئلة: {total}</p>
      <p className="text-xl mb-2">إجابات صحيحة: {correctCount}</p>
      <p className="text-xl mb-6">نسبة النجاح: {percentage}%</p>

      <div className="flex flex-col gap-4 mt-8 w-full max-w-sm">
        <button
          onClick={() => setShowReview(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold"
        >
          🔍 مراجعة إجاباتك
        </button>

        <button
          onClick={onRestart}
          className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-bold"
        >
          🔁 إعادة الاختبار
        </button>
      </div>
    </div>
  );
};

export default Result;
