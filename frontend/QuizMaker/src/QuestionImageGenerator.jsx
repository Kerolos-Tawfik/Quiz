import React, { useEffect, useState } from 'react';
import axios from 'axios';


const QuestionPrintableView = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [distribution, setDistribution] = useState({});
  const [questionColor, setQuestionColor] = useState('#ffffff'); // ← لون الخلفية
  const [breakMode, setBreakMode] = useState('per-question'); // 'per-question' | 'multi'
  const [fontSize, setFontSize] = useState('18px'); // ← حجم الخط الافتراضي

  const arabicLetters = ['أ', 'ب', 'ج', 'د'];
  const EnglishLetters = ['A', 'B', 'C', 'D'];
  useEffect(() => {
    const link = document.getElementById('print-style');
    if (link) {
      link.href = breakMode === 'per-question'
        ? '/pdfSmall.css'
        : '/pdfNormal.css';
    }
  }, [breakMode]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [questionsRes, distRes] = await Promise.all([
          axios.get('https://api.alamthal.org/api/questions'),
          axios.get('https://api.alamthal.org/api/pdf-distribution')
        ]);

        const allQuestions = questionsRes.data.data;
        const dist = distRes.data || {};
        setDistribution(dist);

        const filtered = [];
        Object.entries(dist).forEach(([category, count]) => {
          const catQuestions = allQuestions.filter(q => q.category === category);
          filtered.push(...catQuestions.slice(0, count));
        });

        setQuestions(filtered);
      } catch (err) {
        console.error('❌ خطأ أثناء التحميل', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (window.MathJax && questions.length > 0) {
      window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub]);
    }
  }, [questions,questionColor,fontSize,breakMode
  ]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-2xl font-bold">
        جاري تحميل الأسئلة... ⏳
      </div>
    );
  }

  return (
    <div className="font-[Tajawal] bg-white text-black print:p-0">
      {/* ✅ اختيار اللون */}
      <div className="text-center mb-4 print:hidden flex justify-center gap-6">
  <div>
    <label className="font-bold text-lg mx-2">🎨 اختر لون الأسئلة:</label>
    <input
      type="color"
      value={questionColor}
      onChange={(e) => setQuestionColor(e.target.value)}
      className="w-12 h-8 "
    />
  </div>
  <div>
  <label className="font-bold text-lg mx-2">🔠 حجم الخط:</label>
  <input
    type="number"
    min={10}
    max={40}
    step={1}
    value={parseInt(fontSize)}
    onChange={(e) => setFontSize(`${e.target.value}px`)}
    className="p-2 w-20 "
  />
</div>


  <div>
    <label className="font-bold text-lg mx-2">📄 وضع الطباعة:</label>
    <select
      value={breakMode}
      onChange={(e) => setBreakMode(e.target.value)}
      className="p-2 "
    >
      <option value="per-question">سؤال في صفحة</option>
      <option value="multi">عدة أسئلة في صفحة</option>
    </select>
  </div>
</div>

      {questions.map((q, index) => (
        <div
          key={q.id}
          className="w-full question-card max-w-[700px] p-6 m-auto my-8 text-right print:break-after-page"
          style={{
            pageBreakAfter: breakMode === 'per-question' ? 'always' : 'auto',
          }}
          
        >
        <div
  className="leading-relaxed mb-4"
  style={{
    color: questionColor,
    fontSize: fontSize
  }}
  dangerouslySetInnerHTML={{
    __html: q.content
      ?.replaceAll('@@PLUGINFILE@@', '/images')
      ?.replaceAll('<img', '<img style="display:block; margin:auto; max-width:100%;"'),
  }}
/>

<div className="space-y-2" style={{ fontSize: fontSize }}>
  {q.answers.map((a, i) => (
    <div key={i} className="flex gap-2 items-start">
      <img
        src={`/images/${EnglishLetters[i]}.svg`}
        alt={arabicLetters[i]}
        className="w-6 h-6"
      />
      <span dangerouslySetInnerHTML={{ __html: a.text }} />
    </div>
  ))}
</div>


          <p className="text-green-600 font-bold text-lg mt-6 text-right">
            الإجابة الصحيحة: {arabicLetters[q.answers.findIndex(a => a.is_correct === 1)]}
          </p>
        </div>
      ))}
    </div>
  );
};

export default QuestionPrintableView;
