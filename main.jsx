import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import IndexPortal from './index.jsx'; 
import AdminPanel from './admin.jsx'; 
import StudentDashboard from './student-dashboard.jsx'; 
import TakeExam from './take-exam.jsx';

const App = () => {
  const [path, setPath] = useState(window.location.pathname);
  const [searchParams, setSearchParams] = useState(new URLSearchParams(window.location.search));

  useEffect(() => {
    const handleLocationChange = () => {
      setPath(window.location.pathname);
      setSearchParams(new URLSearchParams(window.location.search));
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateTo = (targetPath) => {
    window.history.pushState({}, '', targetPath);
    const [cleanPath, search] = targetPath.split('?');
    setPath(cleanPath);
    setSearchParams(new URLSearchParams(search || ''));
  };

  if (path === '/admin') return <AdminPanel navigateTo={navigateTo} />;
  if (path === '/dashboard') return <StudentDashboard navigateTo={navigateTo} />;
  if (path === '/take-exam') return <TakeExam examId={searchParams.get('id')} navigateTo={navigateTo} />;
  return <IndexPortal navigateTo={navigateTo} />;
};

ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
