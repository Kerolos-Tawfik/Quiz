// src/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const API_BASE = import.meta.env.VITE_API_URL;


  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      await axios.post(`http://127.0.0.1:8000/api/admin-login`, {
        username,
        password,
      });
  
      localStorage.setItem('admin_logged_in', 'true');
      navigate('/admin');
    } catch (err) {
      alert('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center font-[Tajawal]">
      <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-xl border border-yellow-400 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-yellow-400 text-center">تسجيل دخول المدير</h2>

        <label className="block mb-2 text-yellow-300">اسم المستخدم</label>
        <input
          type="text"
          className="w-full mb-4 p-2 rounded bg-gray-900 border border-yellow-500 text-yellow-200"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="block mb-2 text-yellow-300">كلمة المرور</label>
        <input
          type="password"
          className="w-full mb-6 p-2 rounded bg-gray-900 border border-yellow-500 text-yellow-200"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-2 rounded"
        >
          دخول
        </button>
      </form>
    </div>
  );
};

export default Login;
