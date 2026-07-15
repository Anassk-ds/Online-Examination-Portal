import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './useTheme.js';
import { saveLogin, getLogin, registerUser, loginUser } from './localData.js';

const IndexPortal = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // Pulse effect states for a "live terminal" look
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => (p === 0 ? 1 : 0));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Module 1 (Day-45): Auto-navigate if session exists
  useEffect(() => {
    const loggedInUser = getLogin();
    if (loggedInUser && loggedInUser.role) {
      navigate(loggedInUser.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [navigate]);

  // Student States
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [isStudentRegister, setIsStudentRegister] = useState(false);

  // Admin States
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminRegister, setIsAdminRegister] = useState(false);

  // UI Status Alerts
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const scrollContainerRef = useRef(null);

  // Smooth Scroll Controller
  const scrollToPanel = (panelIndex) => {
    setError('');
    setSuccess('');
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: panelIndex * scrollContainerRef.current.clientWidth,
        behavior: 'smooth'
      });
    }
  };

  const handleAuth = (e, type, isRegister) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const name = type === 'admin' ? adminName : studentName;
    const email = type === 'admin' ? adminEmail : studentEmail;
    const password = type === 'admin' ? adminPassword : studentPassword;

    if (isRegister && !name.trim()) {
      return setError('Please enter your full name.');
    }
    if (!email.trim() || !password.trim()) {
      return setError('Please fill in all secure authentication inputs.');
    }

    setSubmitting(true);

    if (isRegister) {
      const result = registerUser({ name, email, password, role: type });
      if (!result.success) {
        setError(result.message);
      } else {
        setSuccess('✅ Registered! You can now sign in.');
        if (type === 'admin') setIsAdminRegister(false);
        else setIsStudentRegister(false);
      }
    } else {
      const result = loginUser(email, password);
      if (!result.success) {
        setError(result.message);
      } else {
        const user = result.user;
        saveLogin({ email: user.email, name: user.name, role: user.role });
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userName', user.name);
        localStorage.setItem('userRole', user.role);
        navigate(user.role === 'admin' ? '/admin' : '/dashboard');
      }
    }
    setSubmitting(false);
  };

  return (
    <div style={styles.viewWindow}>
      {/* Hidden injection block ensuring structural keyframes render perfectly */}
      <style>{`
        @keyframes subtleFloating {
          0% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-15px) scale(1.03); }
          100% { transform: translateY(0px) scale(1); }
        }
        .animated-live-card {
          animation: subtleFloating 6s infinite ease-in-out;
        }
        input:focus {
          border-color: #2563eb !important;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15) !important;
        }
        .dark-focus input:focus {
          border-color: #60a5fa !important;
          box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.25) !important;
        }
      `}</style>

      <button
        onClick={toggleTheme}
        style={styles.themeToggle}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      <div style={styles.scrollWrapper} ref={scrollContainerRef}>
        
        {/* ================= PANEL 1: STUDENT PORTAL ================= */}
        <div style={styles.panelPageLight}>
          <div 
            className="animated-live-card" 
            style={{ 
              ...styles.card, 
              boxShadow: pulse === 0 
                ? '0 20px 25px -5px rgba(16, 185, 129, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
                : '0 25px 30px -5px rgba(16, 185, 129, 0.2), 0 12px 15px -5px rgba(0, 0, 0, 0.06)',
              transition: 'box-shadow 3s ease-in-out'
            }}
          >
            <div style={styles.header}>
              <h2 style={{ color: '#1f2937', margin: '0 0 5px 0' }}>Student Portal</h2>
              <div style={styles.liveIndicatorContainer}>
                <span style={styles.liveDotGreen}></span>
                <p style={{ color: '#6b7280', fontSize: '11px', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Terminal Online</p>
              </div>
            </div>

            {error && !isAdminRegister && <div style={styles.errorAlert}>⚠️ {error}</div>}
            {success && !isAdminRegister && <div style={styles.successAlert}>{success}</div>}

            <form onSubmit={(e) => handleAuth(e, 'student', isStudentRegister)} style={styles.form}>
              {isStudentRegister && (
                <div style={styles.inputGroup}>
                  <label style={styles.labelLight}>Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Jane Doe" 
                    value={studentName}
                    onChange={e => setStudentName(e.target.value)}
                    required 
                    style={styles.lightInput}
                  />
                </div>
              )}
              <div style={styles.inputGroup}>
                <label style={styles.labelLight}>Student Email</label>
                <input 
                  type="email" 
                  placeholder="student@university.com" 
                  value={studentEmail}
                  onChange={e => setStudentEmail(e.target.value)}
                  required 
                  style={styles.lightInput}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.labelLight}>Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={studentPassword}
                  onChange={e => setStudentPassword(e.target.value)}
                  required 
                  style={styles.lightInput}
                />
              </div>

              <button type="submit" disabled={submitting} style={{ ...styles.studentBtn, opacity: submitting ? 0.7 : 1 }}>
                {submitting ? 'Authenticating...' : (isStudentRegister ? 'Register Profile' : 'Secure Student Sign In')}
              </button>

              <div style={styles.toggleRow}>
                <span onClick={() => { setIsStudentRegister(!isStudentRegister); setError(''); setSuccess(''); }} style={styles.linkLight}>
                  {isStudentRegister ? 'Already have an account? Sign In' : 'New student? Register Here'}
                </span>
              </div>
            </form>

            <div style={styles.switchTerminalBox}>
              <p style={{ fontSize: '13px', color: '#4b5563', margin: '0 0 8px 0' }}>Need administrative tools?</p>
              <button type="button" onClick={() => scrollToPanel(1)} style={styles.slideNextBtn}>
                Slide to Admin Console ➔
              </button>
            </div>
          </div>
        </div>

        {/* ================= PANEL 2: ADMIN SYSTEM CONSOLE ================= */}
        <div style={styles.panelPageDark}>
          <div 
            className="animated-live-card dark-focus" 
            style={{ 
              ...styles.card, 
              backgroundColor: '#1f2937', 
              border: '1px solid #374151',
              boxShadow: pulse === 0 
                ? '0 20px 25px -5px rgba(79, 70, 229, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.2)' 
                : '0 25px 35px -5px rgba(79, 70, 229, 0.45), 0 12px 20px -5px rgba(0, 0, 0, 0.3)',
              transition: 'box-shadow 3s ease-in-out'
            }}
          >
            <div style={styles.header}>
              <h2 style={{ color: '#f9fafb', margin: '0 0 5px 0' }}>Admin Console</h2>
              <div style={styles.liveIndicatorContainer}>
                <span style={styles.liveDotBlue}></span>
                <p style={{ color: '#9ca3af', fontSize: '11px', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Infrastructure Nodes Active</p>
              </div>
            </div>

            {error && isAdminRegister && <div style={styles.errorAlert}>⚠️ {error}</div>}
            {success && isAdminRegister && <div style={styles.successAlert}>{success}</div>}

            <form onSubmit={(e) => handleAuth(e, 'admin', isAdminRegister)} style={styles.form}>
              {isAdminRegister && (
                <div style={styles.inputGroup}>
                  <label style={styles.labelDark}>Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Admin Name" 
                    value={adminName}
                    onChange={e => setAdminName(e.target.value)}
                    required 
                    style={styles.darkInput}
                  />
                </div>
              )}
              <div style={styles.inputGroup}>
                <label style={styles.labelDark}>Admin Email</label>
                <input 
                  type="email" 
                  placeholder="admin@university.com" 
                  value={adminEmail}
                  onChange={e => setAdminEmail(e.target.value)}
                  required 
                  style={styles.darkInput}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.labelDark}>Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  required 
                  style={styles.darkInput}
                />
              </div>

              <button type="submit" disabled={submitting} style={{ ...styles.adminBtn, opacity: submitting ? 0.7 : 1 }}>
                {submitting ? 'Deploying...' : (isAdminRegister ? 'Deploy New Admin' : 'Secure Admin Login')}
              </button>

              <div style={styles.toggleRow}>
                <span onClick={() => { setIsAdminRegister(!isAdminRegister); setError(''); setSuccess(''); }} style={styles.linkDark}>
                  {isAdminRegister ? 'Cancel Registration' : 'New Admin? Register Profile'}
                </span>
              </div>
            </form>

            <div style={{ ...styles.switchTerminalBox, borderTop: '1px solid #374151' }}>
              <p style={{ fontSize: '13px', color: '#9ca3af', margin: '0 0 8px 0' }}>Are you a test taker?</p>
              <button type="button" onClick={() => scrollToPanel(0)} style={styles.slidePrevBtn}>
                ◀ Return to Student Portal
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const styles = {
  viewWindow: { width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', fontFamily: 'sans-serif' },
  scrollWrapper: { display: 'flex', width: '100%', height: '100%', overflowX: 'hidden', scrollSnapType: 'x mandatory' },
  panelPageLight: { minWidth: '100vw', height: '100vh', backgroundColor: '#f3f4f6', display: 'flex', justifyContent: 'center', alignItems: 'center', scrollSnapAlign: 'start' },
  panelPageDark: { minWidth: '100vw', height: '100vh', backgroundColor: '#111827', display: 'flex', justifyContent: 'center', alignItems: 'center', scrollSnapAlign: 'start' },
  themeToggle: { position: 'absolute', top: '20px', right: '20px', zIndex: 10, background: 'rgba(156, 163, 175, 0.15)', border: 'none', padding: '10px 14px', borderRadius: '50%', cursor: 'pointer', fontSize: '16px', transition: 'transform 0.2s' },
  card: { backgroundColor: '#ffffff', padding: '35px', borderRadius: '20px', width: '100%', maxWidth: '360px', transition: 'all 0.4s ease' },
  header: { textAlign: 'center', marginBottom: '25px' },
  liveIndicatorContainer: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '4px' },
  liveDotGreen: { width: '7px', height: '7px', backgroundColor: '#10b981', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 8px #10b981' },
  liveDotBlue: { width: '7px', height: '7px', backgroundColor: '#60a5fa', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 8px #60a5fa' },
  form: { display: 'flex', flexDirection: 'column
