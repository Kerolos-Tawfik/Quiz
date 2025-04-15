import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import StudentInfo from './studentInfo';
import Questions from './Questions';
import Result from './Result';
import AdminPanel from './adminPanel';

function App() {
  const [student, setStudent] = useState(null);

  return (
    <Routes>
      <Route path="/" element={<StudentInfo setStudent={setStudent} />} />
      <Route path="/Questions" element={<Questions student={student} />} />
      <Route path="/Result" element={<Result />} />
      <Route path="/admin" element={<AdminPanel />} />
    </Routes>
  );
}

export default App;
