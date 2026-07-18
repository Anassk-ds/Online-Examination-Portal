import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './useTheme.js';
import { getUsers, saveUsers } from './localData.js';
import { FiSun, FiMoon, FiEye, FiEyeOff, FiUser, FiMail, FiLock, FiShield, FiArrowRight } from 'react-icons/fi';

const IndexPortal = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    const storedEmail = localStorage.getItem('userEmail');
    if (storedRole && storedEmail) {
      navigate(storedRole === 'admin' ? '/admin' : '/dashboard');
    }
  }, [navigate]);

  const [activePanel, setActivePanel] = useState(0);

  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [isStudentRegister, setIsStudentRegister] = useState(false);

  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [masterAdminEmail, setMasterAdminEmail] = useState('');
  const [isAdminRegister, setIsAdminRegister] = useState(false);

  const [showStudentPassword, setShowStudentPassword] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAuth = (e, type, isRegister) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const name = type === 'admin' ? adminName : studentName;
    const email = type === 'admin' ? adminEmail : studentEmail;
    const password = type === 'admin' ? adminPassword : studentPassword;

    if (!email.trim() || !password.trim() || (isRegister && !name.trim())) {
      return setError('Please fill in all fields.');
    }
    if (type === 'admin' && isRegister && !masterAdminEmail.trim()) {
      return setError('Master Admin verification code is required.');
    }

    const users = getUsers();

    if (isRegister) {
      if (users.some((u) => u.email === email)) {
        setError('An account with this email already exists.');
        return;
      }

      const newUser = { id: crypto.randomUUID(), name, email, password, role: type, isApproved: type === 'admin' };
      saveUsers([...users, newUser]);

      if (type === 'student') {
        setSuccess('Registered! Your account is pending Admin approval before you can sign in.');
        setIsStudentRegister(false);
        setStudentName(''); setStudentEmail(''); setStudentPassword('');
      } else {
        setSuccess('Admin account created! You can now sign in.');
        setIsAdminRegister(false);
        setAdminName(''); setAdminEmail(''); setAdminPassword(''); setMasterAdminEmail('');
      }
      return;
    }

    const match = users.find((u) => u.email === email && u.password === password);
    if (!match) {
      setError('Invalid email or password.');
      return;
    }
    if (match.role === 'student' && !match.isApproved) {
      setError('Your account is pending Admin approval.');
      return;
    }

    localStorage.setItem('userEmail', match.email);
    localStorage.setItem('userName', match.name);
    localStorage.setItem('userRole', match.role);
    navigate(match.role === 'admin' ? '/admin' : '/dashboard');
  };

  return (
    <div className="portal-window page-fade-in">
      <button
        onClick={toggleTheme}
        className="theme-toggle-btn btn-animated"
        style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10 }}
      >
        {theme === 'light' ? <FiMoon /> : <FiSun />}
      </button>

      {/* Student panel */}
      <div className="portal-panel" style={{ display: activePanel === 0 ? 'flex' : 'none' }}>
        <div className="portal-card card-animated">
          <div className="portal-header">
            <h2 style={{ color: '#1f2937' }}>Student Portal</h2>
            <p style={{ color: '#6b7280' }}>Online Examination Terminal</p>
          </div>

          {error && activePanel === 0 && <div className="alert-error">{error}</div>}
          {success && activePanel === 0 && <div className="alert-success">{success}</div>}

          <form onSubmit={(e) => handleAuth(e, 'student', isStudentRegister)} className="portal-form">
            {isStudentRegister && (
              <div className="portal-field">
                <label className="portal-label">Full Name</label>
                <input type="text" placeholder="Your full name" value={studentName} onChange={e => setStudentName(e.target.value)} required className="portal-input input-animated" />
              </div>
            )}
            <div className="portal-field">
              <label className="portal-label">Student Email</label>
              <input type="email" placeholder="student@university.com" value={studentEmail} onChange={e => setStudentEmail(e.target.value)} required className="portal-input input-animated" />
            </div>
            <div className="portal-field">
              <label className="portal-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showStudentPassword ? 'text' : 'password'} placeholder="••••••••" value={studentPassword} onChange={e => setStudentPassword(e.target.value)} required className="portal-input input-animated" style={{ paddingRight: '40px' }} />
                <button type="button" onClick={() => setShowStudentPassword(!showStudentPassword)} className="password-toggle-btn" aria-label="Toggle password visibility">
                  {showStudentPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button type="submit" className="portal-btn-student btn-animated">
              {isStudentRegister ? 'Register Profile' : 'Sign In'}
            </button>

            <div className="portal-toggle-row">
              <span onClick={() => { setError(''); setSuccess(''); setIsStudentRegister(!isStudentRegister); }} className="portal-link btn-animated">
                {isStudentRegister ? 'Already have an account? Sign In' : 'New student? Register Here'}
              </span>
            </div>
          </form>

          <div className="portal-switch-box">
            <p>Need administrative tools?</p>
            <button type="button" onClick={() => { setError(''); setSuccess(''); setActivePanel(1); }} className="portal-slide-btn btn-animated">
              Slide to Admin Console <FiArrowRight style={{ marginLeft: '4px' }} />
            </button>
          </div>
        </div>
      </div>

      {/* Admin panel */}
      <div className="portal-panel portal-panel-dark" style={{ display: activePanel === 1 ? 'flex' : 'none' }}>
        <div className="portal-card portal-card-dark card-animated">
          <div className="portal-header">
            <h2 style={{ color: '#f9fafb' }}>Admin Console</h2>
            <p style={{ color: '#9ca3af' }}>Secure Infrastructure Access</p>
          </div>

          {error && activePanel === 1 && <div className="alert-error">{error}</div>}
          {success && activePanel === 1 && <div className="alert-success">{success}</div>}

          <form onSubmit={(e) => handleAuth(e, 'admin', isAdminRegister)} className="portal-form">
            {isAdminRegister && (
              <div className="portal-field">
                <label className="portal-label-dark">Full Name</label>
                <input type="text" placeholder="Your full name" value={adminName} onChange={e => setAdminName(e.target.value)} required className="portal-input-dark input-animated" />
              </div>
            )}
            <div className="portal-field">
              <label className="portal-label-dark">Admin Email</label>
              <input type="email" placeholder="admin@university.com" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} required className="portal-input-dark input-animated" />
            </div>
            <div className="portal-field">
              <label className="portal-label-dark">Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showAdminPassword ? 'text' : 'password'} placeholder="••••••••" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} required className="portal-input-dark input-animated" style={{ paddingRight: '40px' }} />
                <button type="button" onClick={() => setShowAdminPassword(!showAdminPassword)} className="password-toggle-btn password-toggle-btn-dark" aria-label="Toggle password visibility">
                  {showAdminPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {isAdminRegister && (
              <div className="portal-field">
                <label className="portal-label-dark">Master Admin Verification Code</label>
                <input type="text" placeholder="Verification code" value={masterAdminEmail} onChange={e => setMasterAdminEmail(e.target.value)} required className="portal-input-dark input-animated" />
              </div>
            )}

            <button type="submit" className="portal-btn-admin btn-animated">
              {isAdminRegister ? 'Create Admin Account' : 'Sign In'}
            </button>

            <div className="portal-toggle-row">
              <span onClick={() => { setError(''); setSuccess(''); setIsAdminRegister(!isAdminRegister); }} className="portal-link-dark btn-animated">
                {isAdminRegister ? 'Return to Standard Admin Login' : 'New Admin? Register Here'}
              </span>
            </div>
          </form>

          <div className="portal-switch-box" style={{ borderTop: '1px solid #374151' }}>
            <p style={{ color: '#9ca3af' }}>Are you a student?</p>
            <button type="button" onClick={() => { setError(''); setSuccess(''); setActivePanel(0); }} className="portal-slide-btn btn-animated" style={{ color: '#94a3b8', borderColor: '#4b5563' }}>
              <FiUser style={{ marginRight: '6px' }} /> Return to Student Portal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexPortal;
