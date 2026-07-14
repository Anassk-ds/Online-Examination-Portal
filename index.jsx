import React, { useState, useRef } from 'react';

const IndexPortal = ({ navigateTo }) => {
  // Student States
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [isStudentRegister, setIsStudentRegister] = useState(false);

  // Admin States
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [masterAdminEmail, setMasterAdminEmail] = useState(''); 
  const [isAdminRegister, setIsAdminRegister] = useState(false);

  // UI Status Alerts
  const [error, setError] = useState('');
  const scrollContainerRef = useRef(null);

  // Smooth Scroll Controller
  const scrollToPanel = (panelIndex) => {
    setError('');
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: panelIndex * scrollContainerRef.current.clientWidth,
        behavior: 'smooth'
      });
    }
  };

  // Auth Handler
  const handleAuth = (e, type, isRegister) => {
    e.preventDefault();
    setError('');
    const email = type === 'admin' ? adminEmail : studentEmail;
    const password = type === 'admin' ? adminPassword : studentPassword;

    if (!email.trim() || !password.trim()) {
      return setError('Please fill in all secure authentication inputs.');
    }
    if (type === 'admin' && isRegister && !masterAdminEmail.trim()) {
      return setError('Access Denied: Master Admin email verification signature required.');
    }

    localStorage.setItem('userEmail', email);
    localStorage.setItem('userRole', type);
    if (type === 'admin') { navigateTo('/admin'); } else { navigateTo('/dashboard'); }
  };

  return (
    <div className="view-window">
      {/* Pure CSS Character Wrapper Layer */}
      <div className="pure-css-walker">
        <div className="human-head"></div>
        <div className="human-body"></div>
        <div className="office-bag">
          <div className="office-bag-handle"></div>
        </div>
        <div className="human-leg leg-left"></div>
        <div className="human-leg leg-right"></div>
      </div>

      <div className="scroll-wrapper" ref={scrollContainerRef}>
        
        {/* ================= PANEL 1: STUDENT PORTAL ================= */}
        <div className="panel-page-light">
          <div className="portal-card">
            <div className="portal-header">
              <h2>Student Portal</h2>
              <p>Online Examination Terminal</p>
            </div>

            {error && !isAdminRegister && <div className="error-alert">⚠️ {error}</div>}

            <form onSubmit={(e) => handleAuth(e, 'student', isStudentRegister)} className="portal-form">
              <div className="input-group">
                <label className="label-light">Student Email</label>
                <input 
                  type="email" 
                  placeholder="student@university.com" 
                  value={studentEmail}
                  onChange={e => setStudentEmail(e.target.value)}
                  required 
                  className="light-input"
                />
              </div>
              <div className="input-group">
                <label className="label-light">Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={studentPassword}
                  onChange={e => setStudentPassword(e.target.value)}
                  required 
                  className="light-input"
                />
              </div>

              <button type="submit" className="student-btn">
                {isStudentRegister ? 'Register Profile' : 'Secure Student Sign In'}
              </button>

              <div className="toggle-row">
                <span onClick={() => setIsStudentRegister(!isStudentRegister)} className="link-light">
                  {isStudentRegister ? 'Already have an account? Sign In' : 'New student? Register Here'}
                </span>
              </div>
            </form>

            <div className="switch-terminal-box">
              <p>Need administrative tools?</p>
              <button type="button" onClick={() => scrollToPanel(1)} className="slide-next-btn">
                Slide to Admin Console ➔
              </button>
            </div>
          </div>
        </div>

        {/* ================= PANEL 2: ADMIN SYSTEM CONSOLE ================= */}
        <div className="panel-page-dark">
          <div className="portal-card dark-card">
            <div className="portal-header">
              <h2 style={{ color: '#f9fafb' }}>Admin Console</h2>
              <p style={{ color: '#9ca3af' }}>Secure Infrastructure Access</p>
            </div>

            {error && isAdminRegister && <div className="error-alert">⚠️ {error}</div>}

            <form onSubmit={(e) => handleAuth(e, 'admin', isAdminRegister)} className="portal-form">
              <div className="input-group">
                <label className="label-dark">Admin Email</label>
                <input 
                  type="email" 
                  placeholder="admin@university.com" 
                  value={adminEmail}
                  onChange={e => setAdminEmail(e.target.value)}
                  required 
                  className="dark-input"
                />
              </div>
              <div className="input-group">
                <label className="label-dark">Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  required 
                  className="dark-input"
                />
              </div>

              {isAdminRegister && (
                <div className="input-group">
                  <label className="label-dark" style={{ color: '#f87171' }}>Master Admin Email Verification</label>
                  <input 
                    type="email" 
                    placeholder="existing.admin@university.com" 
                    value={masterAdminEmail}
                    onChange={e => setMasterAdminEmail(e.target.value)}
                    required 
                    className="dark-input border-red"
                  />
                </div>
              )}

              <button type="submit" className="admin-btn">
                {isAdminRegister ? 'Deploy New Admin' : 'Secure Admin Login'}
              </button>

              <div className="toggle-row">
                <span onClick={() => setIsAdminRegister(!isAdminRegister)} className="link-dark">
                  {isAdminRegister ? 'Cancel Registration' : 'New Admin? Register Profile'}
                </span>
              </div>
            </form>

            <div className="switch-terminal-box border-dark">
              <p style={{ color: '#9ca3af' }}>Are you a test taker?</p>
              <button type="button" onClick={() => scrollToPanel(0)} className="slide-prev-btn">
                ◀ Return to Student Portal
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default IndexPortal;
