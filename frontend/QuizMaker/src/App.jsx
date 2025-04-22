import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Questions from './Questions';
import Result from './Result';
import AdminPanel from './adminPanel';
import Login from './Login';
import StudentInfo from './StudentInfo';

function App() {
  const [student, setStudent] = useState(null);

  return (
    <Routes>
      <Route path="/" element={<StudentInfo setStudent={setStudent} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/Questions" element={<Questions student={student} />} />
      <Route path="/Result" element={<Result />} />
      <Route path="/admin" element={<AdminPanel />} />
    </Routes>
  );
}

export default App;
