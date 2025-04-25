// src/StudentInfo.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function StudentInfo({ setStudent }) {
  const [step, setStep] = useState(1); // 1: بيانات, 2: تحقق
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [verifying, setVerifying] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://api.alamthal.org/api/email/send-code', { email });
      setStep(2);
      setMessage('📧 تم إرسال كود التحقق إلى بريدك الإلكتروني. قد تجده في مجلد "Spam".');
    } catch (err) {
      setMessage('❌ حدث خطأ أثناء إرسال الكود. تأكد من صحة البريد الإلكتروني.');
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setVerifying(true);
    try {
      await axios.post('https://api.alamthal.org/api/email/verify-code', { email, code });
      setStudent({ name, phone, email });
      navigate('/Questions');
    } catch (err) {
      setMessage('❌ رمز التحقق غير صحيح أو منتهي الصلاحية.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-yellow-400 flex items-center justify-center font-[Tajawal]">
      <form
        onSubmit={step === 1 ? handleSendCode : handleVerifyCode}
        className="bg-gray-800 p-8 rounded-2xl border border-yellow-500 shadow-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">📋 معلومات الطالب</h2>

        {step === 1 && (
          <>
            <label className="block mb-2 text-yellow-300">الاسم الكامل</label>
            <input
              type="text"
              placeholder="اكتب اسمك"
              className="w-full mb-4 p-3 rounded-lg bg-gray-900 text-yellow-200 border border-yellow-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label className="block mb-2 text-yellow-300">رقم الهاتف</label>
            <input
              type="tel"
              placeholder="05xxxxxxxx"
              className="w-full mb-4 p-3 rounded-lg bg-gray-900 text-yellow-200 border border-yellow-500"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              pattern="05\d{8}"
              title="الرقم يجب أن يبدأ بـ 05 ويتكون من 10 أرقام"
              required
            />

            <label className="block mb-2 text-yellow-300">البريد الإلكتروني</label>
            <input
              type="email"
              placeholder="example@example.com"
              className="w-full mb-6 p-3 rounded-lg bg-gray-900 text-yellow-200 border border-yellow-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </>
        )}

        {step === 2 && (
          <>
            <label className="block mb-2 text-yellow-300">📨 رمز التحقق المرسل</label>
            <input
              type="text"
              placeholder="أدخل رمز التحقق"
              className="w-full mb-4 p-3 rounded-lg bg-gray-900 text-yellow-200 border border-yellow-500"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <p className="text-sm text-yellow-300 mb-4">
              📩 تحقق من البريد الوارد أو مجلد <span className="underline">Spam / Junk</span>.
            </p>
          </>
        )}

        {message && (
          <div className="text-sm text-yellow-300 mb-4 border border-yellow-500 p-3 rounded-lg bg-gray-700">
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={verifying}
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 rounded-lg transition duration-300"
        >
          {step === 1 ? '📨 إرسال رمز التحقق' : verifying ? '⏳ جاري التحقق...' : '🚀 ابدأ الامتحان'}
        </button>
      </form>
    </div>
  );
}

export default StudentInfo;
