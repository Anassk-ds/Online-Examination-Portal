import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './useTheme.js';
import { saveLogin, getLogin, registerUser, loginUser } from './localData.js';

// Import the running man image
import runningManImg from './WhatsApp Image 2026-07-15 at 10.05.08 AM.jpeg';

const IndexPortal = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // Controls when the portal components become interactive (after animation completes)
  const [isInteractive, setIsInteractive] = useState(false);

  useEffect(() => {
    // Enable interaction with input fields after the intro animation finishes (approx 2.4s)
    const timer = setTimeout(() => {
      setIsInteractive(true);
    }, 2400);
    return () => clearTimeout(timer);
  }, []);

  // Module 1 (Day-45): if login details are already in Local Storage, skip form entirely
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
    if (!isInteractive) return; // Prevent submissions during intro

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
      {/* Inject CSS keyframes directly into the document head */}
      <style>{`
        @keyframes runToCenterAndFade {
          0% {
            transform: translate(-50%, -50%) translateX(-100vw) scale(0.9);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -50%) translateX(0px) scale(1);
            opacity: 1;
          }
          75% {
            transform: translate(-50%, -50%) translateX(0px) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) translateX(0px) scale(0.85);
            opacity: 0;
            visibility: hidden;
          }
        }

        @keyframes revealRegistrationCard {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(30px);
            pointer-events: none;
          }
          75% {
            opacity: 0;
            transform: scale(0.8) translateY(30px);
            pointer-events: none;
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0px);
            pointer-events: auto;
          }
        }

        .animated-running-man {
          animation: runToCenterAndFade 2.2s cubic-bezier(0.1, 0.8, 0.2, 1) forwards;
        }

        .animated-portal-card {
          animation: revealRegistrationCard 2.8s cubic-bezier(0.175, 0.885, 0.32, 1.1) forwards;
        }
      `}</style>

      <button
        onClick={toggleTheme}
        className="theme-toggle-btn"
        style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10 }}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      {/* Running Man Image Layer */}
      <img
        src={runningManImg}
        alt="Running Man"
        className="animated-running-man"
        style={styles.runningMan}
      />

      <div style={styles.scrollWrapper} ref={scrollContainerRef}>
        
        {/* ================= PANEL 1: STUDENT PORTAL ================= */}
        <div style={styles.panelPageLight}>
          <div className="animated-portal-card" style={styles.card}>
            <div style={styles.header}>
              <h2 style={{ color: '#1f2937', margin: '0 0 5px 0' }}>Student Portal</h2>
              <p style={{ color: '#6b7280', fontSize: '12px', margin: 0, textTransform: 'uppercase' }}>Online Examination Terminal</p>
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
                    disabled={!isInteractive}
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
                  disabled={!isInteractive}
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
                  disabled={!isInteractive}
                />
              </div>

              <button 
                type="submit" 
                disabled={submitting || !isInteractive} 
                style={{ ...styles.studentBtn, opacity: (submitting || !isInteractive) ? 0.7 : 1 }}
              >
                {submitting ? 'Please wait...' : (isStudentRegister ? 'Register Profile' : 'Secure Student Sign In')}
              </button>

              <div style={styles.toggleRow}>
                <span 
                  onClick={() => { if(isInteractive) { setIsStudentRegister(!isStudentRegister); setError(''); setSuccess(''); } }} 
                  style={{ ...styles.linkLight, cursor: isInteractive ? 'pointer' : 'default' }}
                >
                  {isStudentRegister ? 'Already have an account? Sign In' : 'New student? Register Here'}
                </span>
              </div>
            </form>

            <div style={styles.switchTerminalBox}>
              <p style={{ fontSize: '13px', color: '#4b5563', margin: '0 0 8px 0' }}>Need administrative tools?</p>
              <button 
                type="button" 
                onClick={() => isInteractive && scrollToPanel(1)} 
                style={{ ...styles.slideNextBtn, cursor: isInteractive ? 'pointer' : 'default' }}
                disabled={!isInteractive}
              >
                Slide to Admin Console ➔
              </button>
            </div>
          </div>
        </div>

        {/* ================= PANEL 2: ADMIN SYSTEM CONSOLE ================= */}
        <div style={styles.panelPageDark}>
          <div className="animated-portal-card" style={{ ...styles.card, backgroundColor: '#1f2937', border: '1px solid #374151' }}>
            <div style={styles.header}>
              <h2 style={{ color: '#f9fafb', margin: '0 0 5px 0' }}>Admin Console</h2>
              <p style={{ color: '#9ca3af', fontSize: '12px', margin: 0, textTransform: 'uppercase' }}>Secure Infrastructure Access</p>
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
                    disabled={!isInteractive}
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
                  disabled={!isInteractive}
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
                  disabled={!isInteractive}
                />
              </div>

              <button 
                type="submit" 
                disabled={submitting || !isInteractive} 
                style={{ ...styles.adminBtn, opacity: (submitting || !isInteractive) ? 0.7 : 1 }}
              >
                {submitting ? 'Please wait...' : (isAdminRegister ? 'Deploy New Admin' : 'Secure Admin Login')}
              </button>

              <div style={styles.toggleRow}>
                <span 
                  onClick={() => { if(isInteractive) { setIsAdminRegister(!isAdminRegister); setError(''); setSuccess(''); } }} 
                  style={{ ...styles.linkDark, cursor: isInteractive ? 'pointer' : 'default' }}
                >
                  {isAdminRegister ? 'Cancel Registration' : 'New Admin? Register Profile'}
                </span>
              </div>
            </form>

            <div style={{ ...styles.switchTerminalBox, borderTop: '1px solid #374151' }}>
              <p style={{ fontSize: '13px', color: '#9ca3af', margin: '0 0 8px 0' }}>Are you a test taker?</p>
              <button 
                type="button" 
                onClick={() => isInteractive && scrollToPanel(0)} 
                style={{ ...styles.slidePrevBtn, cursor: isInteractive ? 'pointer' : 'default' }}
                disabled={!isInteractive}
              >
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
  
  // Placed in absolute center of viewport
  runningMan: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '320px',
    height: '320px',
    objectFit: 'cover',
    borderRadius: '16px',
    zIndex: 100,
    pointerEvents: 'none',
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
  },

  card: { 
    backgroundColor: '#ffffff', 
    padding: '35px', 
    borderRadius: '16px', 
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)', 
    width: '100%', 
    maxWidth: '360px'
  },

  header: { textAlign: 'center', marginBottom: '25px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  labelLight: { fontSize: '12px', fontWeight: 'bold', color: '#4b5563' },
  labelDark: { fontSize: '12px', fontWeight: 'bold', color: '#9ca3af' },
  lightInput: { padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: '#fff', color: '#1f2937' },
  darkInput: { padding: '12px', border: '1px solid #4b5563', borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: '#374151', color: '#fff' },
  studentBtn: { backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold' },
  adminBtn: { backgroundColor: '#4f46e5', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold' },
  toggleRow: { textAlign: 'center', marginTop: '5px' },
  linkLight: { fontSize: '13px', color: '#2563eb', textDecoration: 'underline' },
  linkDark: { fontSize: '13px', color: '#60a5fa', textDecoration: 'underline' },
  switchTerminalBox: { borderTop: '1px solid #e5e7eb', marginTop: '25px', paddingTop: '20px', textAlign: 'center' },
  slideNextBtn: { background: 'none', border: '1px solid #cbd5e1', padding: '10px 16px', borderRadius: '8px', fontWeight: 'bold', color: '#4b5563', fontSize: '13px' },
  slidePrevBtn: { background: 'none', border: '1px solid #4b5563', padding: '10px 16px', borderRadius: '8px', fontWeight: 'bold', color: '#9ca3af', fontSize: '13px' },
  errorAlert: { backgroundColor: '#fef2f2', border: '1px solid #fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '15px', textAlign: 'center' },
  successAlert: { backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '15px', textAlign: 'center' }
};

export default IndexPortal;
