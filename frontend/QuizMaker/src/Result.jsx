// src/Results.jsx
import React from 'react';

const Result = ({ questions, userAnswers, onRestart }) => {
  const correctCount = questions.reduce((count, question) => {
    const selectedIndex = userAnswers[question.id];
    const isCorrect = question.answers[selectedIndex]?.is_correct;
    return isCorrect ? count + 1 : count;
  }, 0);

  const total = questions.length;
  const percentage = ((correctCount / total) * 100).toFixed(1);

    function whatsAppHandel(){
          const message = `📊 نتيجتي في الاختبار:
    - عدد الأسئلة: ${total}
    - إجابات صحيحة: ${correctCount}
    - النسبة: ${percentage}%`;
    
        const phone = '201272958454'; // ← غير الرقم هنا
    
        const whatsappURL = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, '_blank'); // ← يفتح رابط واتساب تلقائيًا
 
    }
      
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-[Amiri] text-center flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-yellow-400 mb-6">📊 النتيجة النهائية</h1>
      <p className="text-xl mb-2">عدد الأسئلة: {total}</p>
      <p className="text-xl mb-2">إجابات صحيحة: {correctCount}</p>
      <p className="text-xl mb-6">نسبة النجاح: {percentage}%</p>

      <button
        onClick={onRestart}
        className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold px-6 py-3 rounded-lg mt-4"
      >
   مراجعه الأسئله
      </button>
    </div>
  );
};

export default Result   ;
