import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Timer from './Timer';
import Result from './Result';

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [check, setcheck] = useState(false)
  useEffect(() => {
    axios.get('http://localhost:8000/api/questions')
      .then(res => {
        setQuestions(res.data.data);
        if (window.MathJax) {
          window.MathJax.Hub.Queue([
            ["Typeset", window.MathJax.Hub],
            () => {
              setLoading(false);
            }
          ]);
        } else {
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
    }
  }, [currentIndex, userAnswers, loading]);

  const handleAnswer = (questionId, answerIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const currentQuestion = questions[currentIndex];

  return (
    <>
      {showResults ? (
        <Result
          questions={questions}
          userAnswers={userAnswers}
          onRestart={() => {
            setcheck(true);
            setShowResults(false);

          }}
        />
      ) : (
        <div className="font-tajawal bg-gray-900 min-h-screen text-white  px-6 py-4">
          
          {/* ✅ رأس الصفحة */}
          <div className="flex items-center mb-20">
            
            {/* الوقت وعدد الأسئلة */}
            <div className="  text-gray-300">
              {!check&&!loading&&<Timer durationInSeconds={20} onTimeout={() => setShowResults(true)} />}
              
              <p className="mt-2 font-bold">{currentIndex + 1} من {questions.length} </p>
            </div>
          </div>
  
          {/* ✅ محتوى الصفحة: سؤال يمين، شرح يسار */}
          <div className="flex flex-col md:flex-row gap-6">
            
            {/* ✅ الشرح أو الرسالة (يسار) */}
            <div className="md:w-1/2 bg-gray-800 rounded-lg p-4 shadow-md">
              <h2 className="text-xl mb-3">شرح / ملاحظات</h2>
              <p className="text-gray-300">
              أسئلة الاختيار من متعدد
فيما يلي سؤال يتبعه أربعة اختيارات.
المطلوب ، هو: اختيار الإجابة الصحيحية.
              </p>
            </div>
  
            {/* ✅ الأسئلة والاختيارات (يمين) */}
            <div className="md:w-1/2 bg-gray-800 rounded-lg p-6 shadow-md">
              {loading ? (
                <div className="text-center">
                  <img src="/IMG_3553.png" alt="Logo" className="w-16 h-16 mx-auto animate-spin" />
                  <p className="mt-2 text-gray-400">جاري تحميل الأسئلة...</p>
                </div>
              ) : (
                <>
                  <div className="text-lg mb-6" dangerouslySetInnerHTML={{ __html: currentQuestion?.content }} />
  
                  <div className="grid grid-cols-1 gap-4 mb-6">
                    {currentQuestion.answers.map((a, i) => {
                      const isSelected = userAnswers[currentQuestion.id] === i;
                      return (
                        <button
                          key={i}
                          onClick={() => handleAnswer(currentQuestion.id, i)}
                          className={`transition-all duration-200 rounded-lg px-4 py-3 border border-gray-600 text-right ${
                            isSelected ? 'bg-yellow-500 text-black' : 'bg-gray-700 hover:bg-gray-600'
                          } ${check&&currentQuestion.answers[i]?.is_correct?'outline-2 outline-double outline-green-700':''}`}
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
                      onClick={() =>
                        currentIndex < questions.length - 1
                          ? nextQuestion()
                          : setShowResults(true)
                      }
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
  