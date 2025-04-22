// Questions.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Timer from './Timer';
import Result from './Result';
import { useNavigate } from 'react-router-dom';

const Questions = ({ student }) => {
  const API_BASE = import.meta.env.VITE_API_URL;



  const [settings, setSettings] = useState([]); // الأقسام
  const [allQuestions, setAllQuestions] = useState([]);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionsSeen, setQuestionsSeen] = useState([]);
  const [loading, setLoading] = useState(true);
const [progress, setProgress] = useState(0);
const [sectionStartTime, setSectionStartTime] = useState(null);
const [markedForReview, setMarkedForReview] = useState(() => {
  const saved = localStorage.getItem('review_marks');
  return saved ? JSON.parse(saved) : [];
});


  const [stage, setStage] = useState('intro'); // intro, sectionIntro, inSection, review, result
  const navigate = useNavigate()
  useEffect(() => {
    if (!student) {
      navigate('/');
      return;
    }
    fetchData();
  }, []);

  useEffect(() => {
    let interval;
    if (loading) {
      let value = 0;
      interval = setInterval(() => {
        value += 5;
        setProgress(prev => (prev < 95 ? value : 95));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [loading]);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const [questionsRes, settingsRes] = await Promise.all([
        axios.get(`https://api.alamthal.org/api/questions`),
        axios.get(`https://api.alamthal.org/api/settings`)
      ])
  
      setAllQuestions(questionsRes.data.data);
      setSettings(settingsRes.data);
  
      if (window.MathJax) {
        window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, () => {
          setProgress(100);
          setTimeout(() => setLoading(false), 300);
        }]);
      } else {
        setLoading(false);
      }
  
      setStage('intro');
    } catch (err) {
      console.error('خطأ في تحميل البيانات', err);
      setLoading(false);
    }
    
  };useEffect(() => {
    
      if (window.MathJax) {
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
   
      }
       
    }, [currentIndex, userAnswers, loading,questionsSeen,settings,stage,markedForReview]);
  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen text-white flex items-center justify-center flex-col p-8 font-[Tajawal]">
        <div className="w-full max-w-md">
          <div className="bg-gray-700 rounded-full h-6 overflow-hidden mb-4">
            <div
              className="bg-yellow-400 h-6 transition-all duration-200 ease-in-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-yellow-300 font-bold text-lg">جاري تحميل الأسئلة والمعادلات ({progress}%) ...</p>
        </div>
      </div>
    );
  }
  
  
  const startSection = () => {
    const current = settings[sectionIndex];
    const questions = [];

    for (const [bank, count] of Object.entries(current.questions_per_bank)) {
      const filtered = allQuestions.filter(q => q.category === bank);
      const shuffled = filtered.sort(() => 0.5 - Math.random());
      questions.push(...shuffled.slice(0, count));
    }
    setQuestionsSeen(prev => [...prev, ...questions]);

    setCurrentQuestions(questions);
    setCurrentIndex(0);
    setSectionStartTime(Date.now());
    setStage('inSection');
  };

  const finishSection = () => {

    setStage('review');
  };

  const nextSection = () => {
    if (sectionIndex + 1 < settings.length) {
      setSectionIndex(prev => prev + 1);
      setStage('sectionIntro');
    } else {
      setStage('result');
    }
  };

  const handleAnswer = (questionId, answerIndex) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const current = currentQuestions[currentIndex];

  // ---------------------- UI Phases ----------------------
  if (stage === 'intro') {
    return (
      
      <div className="text-center p-8 text-white bg-gray-900 min-h-screen">
        <h1 className="text-3xl font-bold mb-4">📝 الامتحان يتكون من {settings.length} أقسام</h1>
        <ul className="mb-6">
          {settings.map((s, i) => (
            <li key={i} className="text-yellow-300">- {s.name}</li>
          ))}
        </ul>
        <button onClick={() => setStage('sectionIntro')} className="bg-yellow-500 text-black px-6 py-3 rounded-xl font-bold">ابدأ الامتحان</button>
      </div>
    );
  }

  if (stage === 'sectionIntro') {
    const sec = settings[sectionIndex];
    return (
      <div className="text-center p-8 text-white bg-gray-900 min-h-screen">
        <h2 className="text-2xl font-bold mb-2">📚 {sec.name}</h2>
        <p className="mb-2">⏱️ المدة: {sec.duration} ثانية</p>
      
        <button onClick={startSection} className="bg-green-500 px-6 py-3 text-black rounded-xl font-bold">ابدأ هذا القسم</button>
      </div>
    );
  }

  if (stage === 'review') {
    const secQuestions = currentQuestions;
    return (
      <div className="text-white p-8 bg-gray-900 min-h-screen">
        <h2 className="text-2xl mb-6">📋 مراجعة {settings[sectionIndex].name}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {secQuestions.map((q, i) => (
           <button
           key={q.id}
           onClick={() => {
            const elapsed = Math.floor((Date.now() - sectionStartTime) / 1000);
            const remaining = settings[sectionIndex].duration - elapsed;
          
            if (remaining <= 0) return; // ⛔ ممنوع الرجوع بعد انتهاء الوقت
          
            const questionIndex = currentQuestions.findIndex(qq => qq.id === q.id);
            if (questionIndex !== -1) {
              setCurrentIndex(questionIndex);
              setStage('inSection');
            }
          }}
          
           className="p-3 bg-gray-800 rounded-lg border border-yellow-500 text-left hover:bg-gray-700 transition"
         >
           <p className="mb-1 font-bold">
  سؤال {i + 1} {markedForReview.includes(q.id) && <span className="text-blue-400">🔖</span>}
</p>           <p className={userAnswers[q.id] === undefined ? 'text-red-400' : 'text-green-400'}>
             {userAnswers[q.id] === undefined ? 'غير مكتمل' : 'مكتمل'}
           </p>

         </button>))}
        </div>
        <div className="text-center mt-6">
          <button onClick={nextSection} className="bg-yellow-500 px-6 py-3 rounded-xl text-black font-bold">
            {sectionIndex + 1 < settings.length ? 'التالي ▶️' : 'عرض النتيجة 🏁'}
          </button>
        </div>
      </div>
    );
  }

  if (stage === 'result') {
    return <Result questions={questionsSeen} userAnswers={userAnswers} student={student} onRestart={() => window.location.reload()} />;
  }

  // ---------- القسم داخل الامتحان ----------
  return (
    <div className="text-white bg-gray-900 min-h-screen p-6">
<div className="fixed top-2 left-40 z-50 bg-gray-900 rounded-xl shadow-lg p-3 flex flex-col items-center">
  <Timer
    durationInSeconds={settings[sectionIndex].duration}
    startTime={sectionStartTime}
    onTimeout={finishSection}
    currentIndex={currentIndex}
    currentQuestions={currentQuestions}
  />

  {markedForReview.includes(current.id) ? (
    <span
      className="text-green-400 font-bold text-sm bg-green-100 px-3 py-1 rounded-md shadow-sm"
    >
      🔖 تمت إضافته للمراجعة
    </span>
  ) : (
    <button
      onClick={() => {
        const updated = [...markedForReview, current.id];
        setMarkedForReview(updated);
        localStorage.setItem('review_marks', JSON.stringify(updated));
      }}
      className="text-blue-500 hover:underline font-bold text-sm bg-blue-100 px-3 py-1 rounded-md shadow-sm"
    >
      📌 أضف للمراجعة
    </button>
  )}

  <p className="text-yellow-300 font-bold text-sm mt-1">
    {`السؤال ${currentIndex + 1} من ${currentQuestions.length}`}
  </p>
</div>


   
<div className=" bg-white rounded-xl shadow-md p-6 mb-8  mt-14 grid grid-cols-4 gap-6">
  {/* ✅ القسم الأيمن: السؤال */}
  <div className="col-span-2  border-zinc-500 p-4 border border-t-0 border-l-1 border-b-0 border-r-0">
    <div className="mb-4 border-b pb-4">
      <h2 className="text-xl font-bold text-gray-900 mb-3">{`السؤال ${currentIndex + 1} من ${currentQuestions.length}`}</h2>
      <div className="mb-4 text-right">
      <div className="mb-4 text-right">
 
</div>

</div>
<div
  className="text-gray-800 self-center leading-relaxed text-[17px]"
  dangerouslySetInnerHTML={{
    __html: current?.content
      ?.replaceAll('@@PLUGINFILE@@', '/images')
      ?.replaceAll('<img', '<img style="display:block; margin:auto;"')
  }}
/>

    </div>

    <div className="grid grid-cols-1 gap-4">
      {current?.answers?.map((a, i) => (
        <button
          key={i}
          onClick={() => handleAnswer(current.id, i)}
          className={`text-right border px-4 py-3 rounded-lg transition-all duration-200 font-bold shadow-sm text-base
            ${userAnswers[current.id] === i
              ? 'bg-yellow-500 text-black border-yellow-500'
              : 'bg-white text-gray-700 hover:bg-yellow-100 border-gray-300'}`}
          dangerouslySetInnerHTML={{ __html: a.text }}
        />
      ))}
    </div>
  </div>

  {/* ✅ القسم الأيسر: معلومات السؤال */}
  <div className="col-span-2 bg-gray-50 border-zinc-400 p-4 border rounded-lg h-fit">
  <h3 className="font-bold text-gray-700 text-lg mb-4">📋 ملاحظات بنك الأسئلة</h3>
<p className="text-gray-800 text-lg mb-2 whitespace-pre-line">
  {
    current?.note
      ? current.note
      : 'لا توجد ملاحظات لهذا البنك'
  }
</p>

   </div>
</div>

{/* ✅ أزرار التنقل */}
<div className="flex justify-between mt-6">
  <button
    onClick={() => setCurrentIndex(prev => prev - 1)}
    disabled={currentIndex <= 0}
    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-semibold disabled:opacity-50"
  >السابق</button>

  <button
    onClick={() => {
      if (currentIndex < currentQuestions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        finishSection();
      }
    }}
    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
  >{currentIndex < currentQuestions.length - 1 ? 'التالي' : 'إنهاء القسم'}</button>
</div>
    </div>
  );
};

export default Questions;
