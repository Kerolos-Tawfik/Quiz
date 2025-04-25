// src/StudentInfo.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function StudentInfo({ setStudent }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setStudent({ name, phone });
    navigate('/Questions');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-yellow-400 flex items-center justify-center font-[Tajawal]">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-2xl border border-yellow-500 shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">📋 معلومات الطالب</h2>

        <label className="block mb-2 text-yellow-300">الاسم الكامل</label>
        <input
          type="text"
          placeholder="اكتب اسمك"
          className="w-full mb-4 p-3 rounded-lg bg-gray-900 text-yellow-200 border border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label className="block mb-2 text-yellow-300">رقم الهاتف</label>
        <input
  type="tel"
  placeholder="05xxxxxxxx"
  className="w-full mb-6 p-3 rounded-lg bg-gray-900 text-yellow-200 border border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  pattern="05\d{8}"
  title="الرقم يجب أن يبدأ بـ 05 ويتكون من 10 أرقام"
  required
/>


        <button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-3 rounded-lg transition duration-300"
        >
          🚀 ابدأ الامتحان
        </button>
      </form>
    </div>
  );
}

export default StudentInfo;
