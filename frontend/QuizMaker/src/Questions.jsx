import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Timer from './Timer';
import Result from './Result';
import { useNavigate } from 'react-router-dom';

const Questions = ({ student }) => {
  const [questions, setQuestions] = useState([]);
  const [settings, setSettings] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [check, setCheck] = useState(false);
  const [progress, setProgress] = useState(0);

  const navigate = useNavigate();

  // ✅ تحميل الإعدادات والأسئلة
  useEffect(() => {
    if (!student) {
      navigate('/');
      return;
    }

    const fetchQuizData = async () => {
      try {
        const [questionsRes, settingsRes] = await Promise.all([
          axios.get('http://localhost:8000/api/questions'),
          axios.get('http://localhost:8000/api/settings')
        ]);

        const allQuestions = questionsRes.data.data;
        const settingsData = settingsRes.data.data[0];
        console.log(settingsData);
        
        

        const filtered = allQuestions.filter(
          (q) => q.category === settingsData.questionBank
        );
        console.log(filtered);
        

        const shuffled = filtered.sort(() => 0.5 - Math.random());
        const sliced = shuffled.slice(0, settingsData.questionCount);
        console.log(shuffled);
        console.log(sliced);
        

        setQuestions(sliced);
        setSettings(settingsData);
       

        if (window.MathJax) {
          window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, () => {
            setProgress(100); // خلي المؤشر يوصل للنهاية
            setTimeout(() => setLoading(false), 300); // فاصل صغير لعرض 100%
          }]);
        } else {
          setLoading(false);
        }
        
      } catch (err) {
        console.error('حدث خطأ في تحميل الأسئلة أو الإعدادات', err);
        
      }
    };

    fetchQuizData();
  }, []);

  useEffect(() => {
    let interval;
  
    if (loading) {
      let value = 0;
      interval = setInterval(() => {
        value += 5;
        setProgress(prev => (prev < 95 ? value : 95)); // ما يخشش في 100 لحد ما نخلص فعلي
      }, 100);
    }
  
    return () => clearInterval(interval);
  }, [loading]);
  
  // ✅ تحديث MathJax عند تغيير الأسئلة
  useEffect(() => {
    
    if (window.MathJax) {
      window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
 
    }
     
  }, [currentIndex, userAnswers, loading,questions,settings]);

  const handleAnswer = (questionId, answerIndex) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const currentQuestion = questions[currentIndex];

  return (
    <>
    
      {showResults ? (
        <Result
          questions={questions}
          userAnswers={userAnswers}
          student={student}
          onRestart={() => {
            setCheck(true);
            setShowResults(false);
          }}
        />
      ) : (
        <div className="font-tajawal bg-gray-900 min-h-screen text-white px-6 py-4">
                  <img src="/public/IMG_3553.png" width={80} height={80} alt="Logo" />

          <div className="flex items-center mb-20">
            <div className="text-gray-300">
              {!check && !loading && settings && (
                <Timer
                  durationInSeconds={parseInt(settings.duration) || 0}
                  onTimeout={() => {
                    setTimeout(() => {
                      setShowResults(true);
                    }, 0);
                  }}
                />
              )}

              <p className="mt-2 font-bold">
                {currentIndex + 1} من {questions.length}
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2 bg-gray-800 rounded-lg p-4 shadow-md">
              <h2 className="text-xl mb-3">شرح / ملاحظات</h2>
              <p className="text-gray-300">
                أسئلة الاختيار من متعدد. اختر الإجابة الصحيحة من بين الخيارات التالية.
              </p>
            </div>

            <div className="md:w-1/2 bg-gray-800 rounded-lg p-6 shadow-md">
            {loading ? (
              <div className="text-center w-full max-w-lg mx-auto">
                <div className="w-full bg-gray-700 rounded-full h-5 overflow-hidden mb-4">
                  <div
                    className="bg-yellow-500 h-5 transition-all duration-200 ease-in-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-yellow-300 font-semibold">جاري تحميل الأسئلة والمعادلات ({progress}%)</p>
              </div>
            ) : (
              // باقي الكود


                <>
                  <div className="text-lg mb-6" dangerouslySetInnerHTML={{ __html: currentQuestion?.content }} />

                  <div className="grid grid-cols-1 gap-4 mb-6">
                  {currentQuestion?.answers?.map((a, i) => {
                      const isSelected = userAnswers[currentQuestion.id] === i;
                      return (
                        <button
                          key={i}
                          onClick={() => handleAnswer(currentQuestion.id, i)}
                          className={`transition-all duration-200 rounded-lg px-4 py-3 border border-gray-600 text-right ${
                            isSelected ? 'bg-yellow-500 text-black' : 'bg-gray-700 hover:bg-gray-600'
                          } ${check && currentQuestion.answers[i]?.is_correct ? 'outline-2 outline-double outline-green-700' : ''}`}
                        >
                          <div dangerouslySetInnerHTML={{ __html: a.text }} />
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={prevQuestion}
                      disabled={currentIndex <= 0}
                      className="bg-yellow-600 hover:bg-yellow-700 px-5 py-2 rounded-lg disabled:opacity-50"
                    >
                      السابق
                    </button>

                    <button
                      onClick={() => currentIndex < questions.length - 1 ? nextQuestion() : setShowResults(true)}
                      className="bg-yellow-600 hover:bg-yellow-700 px-5 py-2 rounded-lg"
                    >
                      {currentIndex < questions.length - 1 ? 'التالي' : 'ارسال'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Questions;
