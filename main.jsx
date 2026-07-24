import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './Landing.jsx';
import Login from './Login.jsx';
import ForgotPassword from './ForgotPassword.jsx';
import AdminPanel from './admin.jsx';
import StudentDashboard from './student-dashboard.jsx';
import TakeExam from './take-exam.jsx';
import ExamDetails from './ExamDetails.jsx';
import NotFound from './NotFound.jsx';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/exams/:id" element={<ExamDetails />} />
        <Route path="/take-exam/:id" element={<TakeExam />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
