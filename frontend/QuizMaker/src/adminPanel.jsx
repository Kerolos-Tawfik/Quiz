import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const [sections, setSections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [results, setResults] = useState([]);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [questionCounts, setQuestionCounts] = useState({});
  const [notes, setNotes] = useState({});
  const [page,setPage] = useState('panel')
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 12;

  const handleDeleteBank = async (categoryName) => {
    if (!window.confirm(`هل أنت متأكد من حذف بنك "${categoryName}"؟`)) return;
  
    try {
      await axios.delete(`http://127.0.0.1:8000/api/question-bank/${categoryName}`);
      setMessage(`✅ تم حذف بنك "${categoryName}" بنجاح`);
  
      // حدث القوائم بعد الحذف
      fetchCategories();
    } catch (err) {
      console.error('❌ فشل في حذف البنك', err);
      setMessage('❌ حدث خطأ أثناء محاولة الحذف');
    }
  };
  const handleDeleteAllStudents = async () => {
    if (!window.confirm('هل أنت متأكد من حذف جميع الطلاب؟')) return;
  
    try {
      const res = await axios.delete(`http://127.0.0.1:8000/api/students/del/all`);
      console.log('عدد الطلاب اللي اتحذفوا:', res.data.deleted);
      setResults([]); // امسحهم من الواجهة بعد الحذف
    } catch (err) {
      console.error('❌ خطأ أثناء حذف الكل', err);
      alert('❌ حدث خطأ أثناء حذف جميع الطلاب');
    }
  };
  
  const filteredResults = results.filter(r =>
    r.name.includes(searchTerm) || r.phone.includes(searchTerm)
  );
  
  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );
  
  
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('admin_logged_in');
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, []);
  
  useEffect(() => {
    fetchCategories();
    fetchResults();
    fetchSettings();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('xml_file', file);
    setLoading(true);
    setMessage('');

    try {
      await axios.post(`http://127.0.0.1:8000/api/question-bank/import`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('✅ تم رفع بنك الأسئلة بنجاح');
      setFile(null);
    } catch (err) {
      console.error(err);
      setMessage('❌ فشل في رفع الملف');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الطالب؟')) return;
  
    try {
      await axios.delete(`http://127.0.0.1:8000/api/students/${id}`);
      // احذف الطالب من النتائج في الواجهة مباشرة بدون ريفرش
      setResults(prev => prev.filter(student => student.id !== id));
    } catch (err) {
      console.error('خطأ أثناء حذف الطالب', err);
      alert('❌ حدث خطأ أثناء محاولة الحذف');
    }
  };
  
  
  const fetchCategories = async () => {
    try {
      const [catsRes, countRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/categories-with-notes'),
        axios.get('http://127.0.0.1:8000/api/category-questions-count'),
      ]);
      setCategories(catsRes.data);
      setQuestionCounts(countRes.data);
  
      // جهّز الملاحظات حسب كل بنك
      const notesMap = {};
      catsRes.data.forEach(cat => {
        notesMap[cat.name] = cat.note || '';
      });
      setNotes(notesMap);
    } catch (err) {
      console.error('خطأ في تحميل التصنيفات أو الأعداد أو الملاحظات', err);
    }
  };
  const handleNoteChange = async (catName, newNote) => {
    try {
      setNotes(prev => ({ ...prev, [catName]: newNote }));
      await axios.post(`http://127.0.0.1:8000/api/question-bank/update-note`, {
        category: catName,
        note: newNote,
      });
    } catch (err) {
      console.error('خطأ في تحديث الملاحظة', err);
    }
  };
    

  const fetchResults = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/students`);
      setResults(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchSettings = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/settings`);
      if (res.data && res.data.length > 0) {
        const fixedSections = res.data.map(section => ({
          name: section.name,
          duration: section.duration,
          questionsPerBank: section.questions_per_bank || {},
        }));
        setSections(fixedSections);
      } else {
        // مفيش إعدادات محفوظة؟ جهز قسم افتراضي
        setSections([{ name: 'القسم 1', duration: 60, questionsPerBank: {} }]);
      }
    } catch (err) {
      console.error('❌ خطأ أثناء تحميل إعدادات الأقسام', err);
      setSections([{ name: 'القسم 1', duration: 60, questionsPerBank: {} }]);
    }
  };
  
  
  
  const addSection = () => {
    const newQuestions = {};
    categories.forEach(cat => (newQuestions[cat] = 0));
    setSections([
      ...sections,
      {
        name: `القسم ${sections.length + 1}`,
        duration: 60,
        questionsPerBank: newQuestions
      }
    ]);
  };

  const removeSection = (index) => {
    const updated = [...sections];
    updated.splice(index, 1);
    setSections(updated);
  };

  const handleSectionChange = (index, field, value) => {
    const updated = [...sections];
    updated[index][field] = value;
    setSections(updated);
  };

  const handleBankQuestionChange = (index, bank, value) => {
    const updated = [...sections];
    updated[index].questionsPerBank[bank] = parseInt(value);
    setSections(updated);
  };

  const handleSaveSettings = async () => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/settings`, { sections });
      alert('✅ تم حفظ الإعدادات بنجاح');
    } catch (err) {
      console.error(err);
      alert('❌ حدث خطأ أثناء الحفظ');
    }
  };

  return (
  
    <div className="min-h-screen bg-gray-900 text-yellow-400 p-8 font-[Tajawal]"> 
     <button
        onClick={() => {
          localStorage.removeItem('admin_logged_in');
          window.location.href = '/login';
        }}
        className="absolute top-4 left-4 bg-red-500 px-4 py-2 rounded font-bold text-white"
      >
        تسجيل الخروج
     </button>
     <div className="flex flex-col md:flex-row justify-center gap-4 mt-20 mb-10">
  <button
    onClick={() => setPage('panel')}
    className={`px-6 py-2 rounded-xl font-bold w-full md:w-auto ${page === 'panel' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-yellow-300'}`}
  >
    ⚙️ إعدادات الأقسام
  </button>

  <button
    onClick={() => setPage('results')}
    className={`px-6 py-2 rounded-xl font-bold w-full md:w-auto ${page === 'results' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-yellow-300'}`}
  >
    📊 نتائج الطلاب
  </button>

  <button
    onClick={() => setPage('upload')}
    className={`px-6 py-2 rounded-xl font-bold w-full md:w-auto ${page === 'upload' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-yellow-300'}`}
  >
    📦 رفع بنك أسئلة
  </button>
</div>
{page === 'panel' && (


<div className="bg-gray-800 p-6 rounded-2xl shadow-xl mb-12 border border-yellow-500">
  <h2 className="text-2xl font-semibold mb-6 text-yellow-300">إعدادات الأقسام</h2>

  {sections.map((section, index) => (
    <div key={index} className="mb-6 p-4 bg-gray-700 rounded-xl border border-yellow-500">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          value={section.name}
          onChange={(e) => handleSectionChange(index, 'name', e.target.value)}
          placeholder="اسم القسم"
          className="w-full p-2 rounded-lg bg-gray-900 text-yellow-300 border border-yellow-500"
        />
        {sections.length > 1 && (
          <button onClick={() => removeSection(index)} className="text-red-500 ml-4">🗑️</button>
        )}
      </div>

      <label className="block text-yellow-400 mb-2">⏱️ مدة القسم (بالثواني)</label>
      <input
        type="number"
        value={section.duration}
        onChange={(e) => handleSectionChange(index, 'duration', e.target.value)}
        className="w-full mb-4 p-2 rounded-lg bg-gray-900 text-yellow-300 border border-yellow-500"
      />

      <h4 className="text-yellow-300 font-semibold mb-2">🗃️ توزيع الأسئلة على البنوك</h4>
      {categories.map((cat, catIndex) => (
<div key={catIndex} className="mb-2 flex items-center">
<span className="w-1/2">{cat.name} {questionCounts[cat.name] || 0} </span>
<input
type="number"
min={0}
max={questionCounts[cat.name] || 0}
value={section.questionsPerBank[cat.name] || 0}
onChange={(e) => handleBankQuestionChange(index, cat.name, e.target.value)}
className="w-1/2 p-2 rounded-lg bg-gray-900 text-yellow-300 border border-yellow-500"
/>
</div>
))}

    </div>
  ))}

  <div className="text-center mt-6">
    <button onClick={addSection} className="bg-green-500 px-6 py-2 rounded-xl font-bold text-gray-900 mx-2">
      ➕ إضافة قسم
    </button>
    <button onClick={handleSaveSettings} className="bg-yellow-500 px-6 py-2 rounded-xl font-bold text-gray-900">
      💾 حفظ الإعدادات
    </button>
  </div>
</div>
)}
{page === 'results' && (
  <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-yellow-500">
    <h2 className="text-2xl font-semibold mb-6 text-yellow-300">📊 نتائج الطلاب</h2>

    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
      <input
        type="text"
        placeholder="🔍 ابحث بالاسم أو رقم الهاتف"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className="p-2 w-full md:w-1/2 rounded-lg bg-gray-900 text-yellow-300 border border-yellow-500"
      />
      {results.length > 0 && (
        <button
          onClick={handleDeleteAllStudents}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold"
        >
          🗑️ حذف الكل
        </button>
      )}
    </div>

    <div className="overflow-auto rounded-lg">
      <table className="min-w-full table-auto text-right text-yellow-100 border-collapse">
        <thead>
          <tr className="bg-yellow-700 text-gray-900">
            <th className="p-3 border border-yellow-600">الاسم</th>
            <th className="p-3 border border-yellow-600">رقم الهاتف</th>
            <th className="p-3 border border-yellow-600">الدرجة</th>
            <th className="p-3 border border-yellow-600">النسبة</th>
            <th className="p-3 border border-yellow-600">التوقيت</th>
            <th className="p-3 border border-yellow-600">إجراء</th>
          </tr>
        </thead>
        <tbody>
          {paginatedResults.length > 0 ? (
            paginatedResults.map((r, i) => (
              <tr key={i} className="hover:bg-yellow-800 transition">
                <td className="p-3 border border-yellow-700">{r.name}</td>
                <td className="p-3 border border-yellow-700">{r.phone}</td>
                <td className="p-3 border border-yellow-700">{r.score}</td>
                <td className="p-3 border border-yellow-700">{r.percentage}%</td>
                <td className="p-3 border border-yellow-700">{r.created_at}</td>
                <td className="p-3 border border-yellow-700 text-center">
                  <button
                    onClick={() => handleDeleteStudent(r.id)}
                    className="text-red-400 hover:text-red-600 font-bold"
                    title="حذف الطالب"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-6 text-yellow-500">
                لا توجد نتائج مطابقة
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {/* Pagination */}
    {totalPages > 1 && (
      <div className="flex justify-center mt-6 gap-2 flex-wrap">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-4 py-2 rounded-xl font-bold border border-yellow-500 ${
              currentPage === i + 1
                ? 'bg-yellow-500 text-gray-900'
                : 'bg-gray-700 text-yellow-300'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    )}
  </div>
)}


{page === 'upload' && (
        <div className="bg-gray-800 p-6 rounded-2xl shadow-xl mb-12 border border-yellow-500 mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-yellow-300">📦 رفع بنك أسئلة جديد</h2>
      <form onSubmit={handleUpload} className="flex flex-col md:flex-row gap-4 items-center mb-6">
        <input
          type="file"
          accept=".xml"
          onChange={(e) => setFile(e.target.files[0])}
          className="p-2 rounded-lg bg-gray-900 text-yellow-300 border border-yellow-500 w-full md:w-1/2"
        />
        <button
          type="submit"
          disabled={!file || loading}
          className="bg-yellow-500 hover:bg-yellow-600 px-6 py-2 rounded-xl font-bold text-gray-900 disabled:opacity-50"
        >
          {loading ? 'جارٍ الرفع...' : 'رفع الملف'}
        </button>
      </form>

      {categories.length > 0 && (
  <div className="mt-6">
    <h3 className="text-lg font-semibold text-yellow-300 mb-2">🗃️ البنوك المتاحة:</h3>
    <table className="w-full text-yellow-200 text-right table-auto border-collapse rounded-xl overflow-hidden">
  <thead>
    <tr className="bg-yellow-700 text-gray-900">
      <th className="p-3 border border-yellow-600">🗃️ اسم البنك</th>
      <th className="p-3 border border-yellow-600">📝 الملاحظات</th>
      <th className="p-3 border border-yellow-600">🔢 عدد الأسئلة + حذف</th>
    </tr>
  </thead>
  <tbody>
    {categories.map((cat, i) => (
      <tr key={i} className="bg-gray-700 hover:bg-gray-600 transition">
        <td className="p-3 border border-yellow-600 font-bold">{cat.name}</td>
        <td className="p-3 border border-yellow-600">
          <textarea
            value={notes[cat.name] || ''}
            onChange={(e) => handleNoteChange(cat.name, e.target.value)}
            placeholder="📝 ملاحظات هذا البنك..."
            className="w-full p-2 rounded bg-gray-900 text-yellow-200 border border-yellow-500 resize-none"
            rows={3}
          />
        </td>
        <td className="p-3 border border-yellow-600 text-center">
          <p className="mb-2">عدد الأسئلة: <span className="font-bold">{questionCounts[cat.name] || 0}</span></p>
          <button
            onClick={() => handleDeleteBank(cat.name)}
            className="text-red-400 hover:text-red-600 font-bold text-sm"
          >
            🗑️ حذف
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

  </div>
)}

      {message && <p className="mt-6 text-yellow-200">{message}</p>}
    </div>
)}

      

    
  
    </div>
  );
};

export default AdminPanel;
