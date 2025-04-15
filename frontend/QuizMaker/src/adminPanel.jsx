// src/pages/AdminPanel.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [settings, setSettings] = useState({
    questionCount: 10,
    questionBank: 'math',
    duration: 120,
  });

  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSaveSettings = async () => {
    try {
      await axios.post('http://localhost:8000/api/settings', settings);
      alert('✅ تم حفظ الإعدادات بنجاح');
    } catch (err) {
      console.error(err);
      alert('❌ حدث خطأ أثناء الحفظ');
    }
  };
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchResults();
    fetchCategories(); // ← هنا
  }, []);
  
  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('خطأ في تحميل التصنيفات', err);
    }
  };
  const fetchResults = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/students');
      setResults(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-yellow-400 p-8 font-[Tajawal]">
        <img src="/public/IMG_3553.png" width={80} height={80} alt="Logo" />
      <h1 className="text-4xl font-bold mb-10 text-center">⚙️ لوحة التحكم </h1>

      <div className="bg-gray-800 p-6 rounded-2xl shadow-xl mb-12 border border-yellow-500">
        <h2 className="text-2xl font-semibold mb-6 text-yellow-300">إعدادات الاختبار</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block mb-2 text-yellow-500">عدد الأسئلة</label>
            <input
              type="number"
              name="questionCount"
              value={settings.questionCount}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-900 text-yellow-300 border border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="block mb-2 text-yellow-500">بنك الأسئلة</label>
            <select
                name="questionBank"
                value={settings.questionBank}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-900 text-yellow-300 border border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                {categories.length > 0 ? (
                    categories.map((cat, i) => (
                    <option key={i} value={cat}>
                        {cat || 'بدون تصنيف'}
                    </option>
                    ))
                ) : (
                    <option value="">جاري التحميل...</option>
                )}
            </select>

          </div>

          <div>
            <label className="block mb-2 text-yellow-500">مدة الامتحان (بالثواني)</label>
            <input
              type="number"
              name="duration"
              value={settings.duration}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-900 text-yellow-300 border border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={handleSaveSettings}
            className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-300"
          >
            💾 حفظ الإعدادات
          </button>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-yellow-500">
        <h2 className="text-2xl font-semibold mb-6 text-yellow-300">📊 نتائج الطلاب</h2>
        <div className="overflow-auto rounded-lg">
          <table className="min-w-full table-auto text-right text-yellow-100 border-collapse">
            <thead>
              <tr className="bg-yellow-700 text-gray-900">
                <th className="p-3 border border-yellow-600">الاسم</th>
                <th className="p-3 border border-yellow-600">رقم الهاتف</th>
                <th className="p-3 border border-yellow-600">الدرجة</th>
                <th className="p-3 border border-yellow-600">النسبة</th>
                <th className="p-3 border border-yellow-600">التوقيت</th>
              </tr>
            </thead>
            <tbody>
              {results.length > 0 ? (
                results.map((r, i) => (
                  <tr key={i} className="hover:bg-yellow-800 transition">
                    <td className="p-3 border border-yellow-700">{r.name}</td>
                    <td className="p-3 border border-yellow-700">{r.phone}</td>
                    <td className="p-3 border border-yellow-700">{r.score}</td>
                    <td className="p-3 border border-yellow-700">{r.precentage}%</td>
                    <td className="p-3 border border-yellow-700">{r.created_at}</td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-yellow-500">
                    لا توجد نتائج حتى الآن
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
