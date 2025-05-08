// src/StudentInfo.jsx
import React, { useState, useRef,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function StudentInfo({ setStudent }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email] = useState('mansuor1396@gmail.com');
  const [code, setCode] = useState(['', '', '', '']);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [message, setMessage] = useState('');
  const [verifying, setVerifying] = useState(false);
  const navigate = useNavigate();

  const phoneRef = useRef(null);
  const codeRef = useRef(null);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      setStep(2);
      setTimeout(() => {
        phoneRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://api.alamthal.org/api/email/send-code', { email, name });
      setStep(3);
      setTimeout(() => {
        codeRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error(err);
      setMessage('❌ فشل إرسال رمز التحقق على الإيميل.');
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
  
    if (pastedData.length === 4) {
      const newCode = pastedData.split('');
      setCode(newCode);
    }
  };
  
  
  
  const handleVerifyCode = async (e) => {
    if (e) e.preventDefault();
    setVerifying(true);
    try {
      await axios.post('https://api.alamthal.org/api/email/verify-code', { email, code: code.join('') });
      setStudent({ name, phone, email });
      navigate('/Questions');
    } catch (err) {
      console.error(err);
      setMessage('❌ رمز التحقق غير صحيح أو منتهي الصلاحية.');
      setIsSubmitted(false); // ✨ رجع يقدر يحاول تاني
    } finally {
      setVerifying(false);
    }
  };
  
  const handleCodeInput = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    let newCode = [...code];
  
    if (value.length > 1) {
      const values = value.slice(0, 4).split('');
      values.forEach((val, idx) => {
        if (index + idx < 4) {
          newCode[index + idx] = val;
        }
      });
      setCode(newCode);
    } else {
      newCode[index] = value;
      setCode(newCode);
  
      if (value && index < 3) {
        e.target.nextSibling?.focus();
      }
    }
  };
  const convertArabicToEnglishNumbers = (input) => {
    return input.replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
  };
  
  
  const handleBackspace = (e, index) => {
    if (e.key === 'Backspace') {
      const newCode = [...code];
      if (code[index]) {
        newCode[index] = '';
        setCode(newCode);
      } else if (index > 0) {
        newCode[index - 1] = '';
        setCode(newCode);
        e.target.previousSibling?.focus();
      }
    }
  };
  useEffect(() => {
    if (code.length === 4 && code.every(c => c !== '') && !isSubmitted) {
      setIsSubmitted(true); // علم إن الكود تحقق
      handleVerifyCode(); // ✅ هنا نتحقق تلقائي لما الكود يكتمل
    }
  }, [code]);
  
  
  
  return (
    <div className="h-screen overflow-y-scroll scroll-smooth snap-y snap-mandatory font-[Tajawal] text-center text-gray-700">

      {/* Step 1 - الاسم */}
      <section className="snap-start min-h-screen flex flex-col justify-center items-center p-8 bg-white">
        <form onSubmit={handleNameSubmit} className="w-full max-w-md">
          <h2 className="text-3xl mb-6">يسعدني وجودك! 🙋‍♂️ ، شرفني بمعرفة اسمك الأول ؟
</h2>
          <input
            type="text"
            className="border-b-2 border-yellow-400 text-xl text-center p-2 w-full focus:outline-none focus:border-yellow-300"
            placeholder=" ممكن كتابة الاسم بالعربي "
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button
            type="submit"
            className="mt-6 bg-yellow-400 text-white px-6 py-2 rounded-sm hover:bg-yellow-300 transition w-full"
          >
نكمل! 🚀          </button>
        </form>
      </section>

      {/* Step 2 - الهاتف */}
      {step >= 2 && (
        <section ref={phoneRef} className="snap-start min-h-screen flex flex-col justify-center items-center p-8 bg-gray-50">
          <form onSubmit={handlePhoneSubmit} className="w-full max-w-md">
            <h2 className="text-3xl mb-4">حياك الله ونورت، {name} 🌷، ممكن رقم الواتساب لإرسال كود الدخول للاختبار </h2>
              <input
              type="tel"
              className="border-b-2 border-yellow-400 text-xl text-center p-2 w-full focus:outline-none focus:border-yellow-300"
              placeholder="05xxxxxxxx"
              value={phone}
              onChange={(e) => setPhone(convertArabicToEnglishNumbers(e.target.value))}
              pattern="05\d{8}"
              title="رقم الجوال يبدأ بـ 05 ويتكون من 10 أرقام"
              required
            />

            <button
              type="submit"
              className="mt-6 bg-yellow-400 text-white px-6 py-2 rounded-sm hover:bg-yellow-300 transition w-full"
            >
إرسل الكود 🔐
</button>
            {message && (
              <div className="text-red-500 mt-4">{message}</div>
            )}
          </form>
        </section>
      )}

      {/* Step 3 - الكود */}
      {step >= 3 && (
  <section ref={codeRef} className="snap-start min-h-screen flex flex-col justify-center items-center p-8 bg-white">
    <form onSubmit={handleVerifyCode} className="w-full max-w-md">
      <h2 className="text-2xl mb-6">أدخل الكود اللي وصلك على الواتساب، وبالتوفيق في اختبارك! 🚀✨</h2>

      <div className="flex justify-center gap-4 mb-6" dir="ltr">
  {code.map((num, index) => (
    <input
      key={index}
      type="text"
      inputMode="numeric"
      maxLength="1"
      className="w-16 h-16 text-2xl text-center border-2 rounded-lg border-yellow-400 focus:outline-none focus:border-yellow-300"
      onChange={(e) => handleCodeInput(e, index)}
      onKeyDown={(e) => handleBackspace(e, index)}
      onPaste={handlePaste}  // ✨ أضف هذا
      value={num}
    />
  ))}
</div>


     

      {message && (
        <div className="text-red-500 mb-4">{message}</div>
      )}

      <button
        type="submit"
        className="mt-4 bg-yellow-400 text-white px-6 py-2 rounded-sm hover:bg-yellow-300 transition w-full"
        disabled={verifying}
      >
        {verifying ? '⏳ جاري التحقق...' : 'انطلق للاختبار 🚀'}
      </button>
    </form>
  </section>
)}


    </div>
  );
}

export default StudentInfo;
