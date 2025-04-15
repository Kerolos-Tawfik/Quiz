import React, { useState } from 'react'
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-8 max-w-md mx-auto">
        <h2 className="text-2xl font-bold">معلومات الطالب</h2>
        <input
          type="text"
          placeholder="الاسم"
          className="border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="رقم التليفون"
          className="border p-2 rounded"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          ابدأ الامتحان
        </button>
      </form>
    );
}

export default StudentInfo
