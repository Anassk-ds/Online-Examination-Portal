import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const IndexPortal = () => {
  const navigate = useNavigate();
  
  // 0 = Student Portal, 1 = Admin Console
  const [activePanel, setActivePanel] = useState(0);

  // Student Authentication States
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [isStudentRegister, setIsStudentRegister] = useState(false);

  // Admin Authentication States
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [masterAdminEmail, setMasterAdminEmail] = useState(''); 
  const [isAdminRegister, setIsAdminRegister] = useState(false);

  const [error, setError] = useState('');

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

    if (type === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div style={{
      ...styles.viewWindow,
      backgroundColor: activePanel === 0 ? '#f0fdf4' : '#0f172a' // Dynamic Background transitions
    }} className="page-fade-in">
      
      {/* Dynamic Slide Container wrapper */}
      <div style={{ 
        ...styles.scrollWrapper, 
        transform: `translateX(-${activePanel * 50}%)` 
      }}>
        
        {/* ==================== PANEL 1: STUDENT VIEWPORT ==================== */}
        <div style={styles.panelPage}>
          <div style={styles.contentFlexRow}>
            
            {/* Vector Man with Form */}
            <div style={styles.graphicColumn}>
              <svg width="280" height="280" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Background ambient circle */}
                <circle cx="100" cy="100" r="70" fill="#dcfce7" />
                {/* Man Body */}
                <path d="M70 150 C70 120, 130 120, 130 150" fill="#10b981" />
                <circle cx="100" cy="90" r="22" fill="#fbcfe8" />
                {/* Hair */}
                <path d="M80 80 C85 70, 115 70, 120 80 C110 75, 90 75, 80 80" fill="#1e293b" />
                {/* Student Clipboard/Form */}
                <rect x="115" y="105" width="45" height="55" rx="4" fill="#ffffff" stroke="#10b981" strokeWidth="3"/>
                <rect x="123" y="115" width="28" height="4" rx="2" fill="#cbd5e1" />
                <rect x="123" y="125" width="28" height="4" rx="2" fill="#cbd5e1" />
                <rect x="123" y="135" width="20" height="4" rx="2" fill="#cbd5e1" />
                <circle cx="145" cy="145" r="4" fill="#10b981" />
              </svg>
              <h3 style={{ color: '#047857', margin: '10px 0 0 0' }}>Student Entry Terminal</h3>
            </div>

            {/* Student Auth Input Box */}
            <div style={styles.card} className="card-animated">
              <div style={styles.header}>
                <h2 style={{ color: '#1f2937', margin: '0 0 5px 0' }}>Student Portal</h2>
                <p style={{ color: '#6b7280', fontSize: '12px', margin: 0, textTransform: 'uppercase' }}>Online Examination Terminal</p>
              </div>

              {error && activePanel === 0 && <div style={styles.errorAlert}>⚠️ {error}</div>}

              <form onSubmit={(e) => handleAuth(e, 'student', isStudentRegister)} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.labelLight}>Student Email</label>
                  <input 
                    type="email" 
                    placeholder="student@university.com" 
                    value={studentEmail}
                    onChange={e => setStudentEmail(e.target.value)}
                    required 
                    style={styles.lightInput}
                    className="input-animated"
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
                    className="input-animated"
                  />
                </div>

                <button type="submit" style={styles.studentBtn} className="btn-animated">
                  {isStudentRegister ? 'Register Profile' : 'Secure Student Sign In'}
                </button>

                <div style={styles.toggleRow}>
                  <span onClick={() => setIsStudentRegister(!isStudentRegister)} style={styles.linkLight} className="btn-animated">
                    {isStudentRegister ? 'Already have an account? Sign In' : 'New student? Register Here'}
                  </span>
                </div>
              </form>

              <div style={styles.switchTerminalBox}>
                <p style={{ fontSize: '13px', color: '#4b5563', margin: '0 0 8px 0' }}>Need administrative tools?</p>
                <button 
                  type="button" 
                  onClick={() => { setError(''); setActivePanel(1); }} 
                  style={styles.slideNextBtn} 
                  className="btn-animated"
                >
                  Slide to Admin Console ➔
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* ==================== PANEL 2: ADMIN VIEWPORT ==================== */}
        <div style={styles.panelPage}>
          <div style={styles.contentFlexRow}>
            
            {/* Vector Man with Office Bag */}
            <div style={styles.graphicColumn}>
              <svg width="280" height="280" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Ambient Circle background */}
                <circle cx="100" cy="100" r="70" fill="#1e293b" />
                {/* Man Body */}
                <path d="M70 150 C70 120, 130 120, 130 150" fill="#4f46e5" />
                <circle cx="100" cy="90" r="22" fill="#fed7aa" />
                {/* Hair & Tie */}
                <path d="M80 80 C85 70, 115 70, 120 80 C110 75, 90 75, 80 80" fill="#451a03" />
                <path d="M96 122 L104 122 L102 138 L98 138 Z" fill="#ef4444" />
                {/* Office Portfolio Briefcase Bag */}
                <rect x="120" y="118" width="46" height="34" rx="5" fill="#78350f" stroke="#f59e0b" strokeWidth="2"/>
                <path d="M133 118 L133 112 C133 110, 153 110, 153 112 L153 118" stroke="#f59e0b" strokeWidth="2" fill="none"/>
                <circle cx="143" cy="135" r="3" fill="#f59e0b" />
              </svg>
              <h3 style={{ color: '#818cf8', margin: '10px 0 0 0' }}>Infrastructure Control Layer</h3>
            </div>

            {/* Admin Input Box */}
            <div style={{ ...styles.card, backgroundColor: '#1e293b', border: '1px solid #334155' }} className="card-animated">
              <div style={styles.header}>
                <h2 style={{ color: '#f8fafc', margin: '0 0 5px 0' }}>Admin Console</h2>
                <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0, textTransform: 'uppercase' }}>Secure Infrastructure Access</p>
              </div>

              {error && activePanel === 1 && <div style={styles.errorAlert}>⚠️ {error}</div>}

              <form onSubmit={(e) => handleAuth(e, 'admin', isAdminRegister)} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.labelDark}>Admin Email</label>
                  <input 
                    type="email" 
                    placeholder="admin@university.com" 
                    value={adminEmail}
                    onChange={e => setAdminEmail(e.target.value)}
                    required 
                    style={styles.darkInput}
                    className="input-animated"
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
                    className="input-animated"
                  />
                </div>

                {isAdminRegister && (
                  <div style={styles.inputGroup}>
                    <label style={styles.labelDark}>Master Admin Code Signature ID</label>
                    <input 
                      type="text" 
                      placeholder="Verification Authority Key" 
                      value={masterAdminEmail}
                      onChange={e => setMasterAdminEmail(e.target.value)}
                      required 
                      style={styles.darkInput}
                      className="input-animated"
                    />
                  </div>
                )}

                <button type="submit" style={styles.adminBtn} className="btn-animated">
                  {isAdminRegister ? 'Provision Master Credentials' : 'Access System Terminal'}
                </button>

                <div style={styles.toggleRow}>
                  <span onClick={() => setIsAdminRegister(!isAdminRegister)} style={styles.linkDark} className="btn-animated">
                    {isAdminRegister ? 'Return to Standard Admin Login' : 'Register New Supervisor Instance'}
                  </span>
                </div>
              </form>

              <div style={{ ...styles.switchTerminalBox, borderTop: '1px solid #334155' }}>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 8px 0' }}>Are you an academic student candidate?</p>
                <button 
                  type="button" 
                  onClick={() => { setError(''); setActivePanel(0); }} 
                  style={{ ...styles.slideNextBtn, color: '#cbd5e1', borderColor: '#4b5563' }} 
                  className="btn-animated"
                >
                  🪟 Return to Student Workspace View
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

const styles = {
  viewWindow: { 
    width: '100vw', 
    height: '100vh', 
    overflow: 'hidden', 
    position: 'relative',
    transition: 'background-color 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
  },
  scrollWrapper: { 
    display: 'flex', 
    flexDirection: 'row',
    flexWrap: 'nowrap',
    width: '200vw', 
    height: '100%', 
    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' 
  },
  panelPage: { 
    width: '50vw', 
    minWidth: '50vw', 
    maxWidth: '50vw', 
    flexBasis: '50vw',
    flexShrink: 0, 
    height: '100%', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: '40px',
    boxSizing: 'border-box'
  },
  contentFlexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '50px',
    width: '100%',
    maxWidth: '900px'
  },
  graphicColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  },
  card: { 
    padding: '40px 35px', 
    borderRadius: '24px', 
    backgroundColor: '#ffffff', 
    boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)', 
    border: '1px solid #e2e8f0', 
    width: '100%', 
    maxWidth: '440px', 
    boxSizing: 'border-box' 
  },
  header: { textAlign: 'center', marginBottom: '24px' },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  labelLight: { fontSize: '12px', fontWeight: 'bold', color: '#4b5563' },
  labelDark: { fontSize: '12px', fontWeight: 'bold', color: '#9ca3af' },
  lightInput: { padding: '13px 16px', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '14px', outline: 'none', color: '#1f2937', width: '100%', boxSizing: 'border-box' },
  darkInput: { padding: '13px 16px', border: '1px solid #4b5563', borderRadius: '10px', fontSize: '14px', outline: 'none', backgroundColor: '#334155', color: '#fff', width: '100%', boxSizing: 'border-box' },
  studentBtn: { backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold', outline: 'none', cursor: 'pointer', width: '100%' },
  adminBtn: { backgroundColor: '#4f46e5', color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold', outline: 'none', cursor: 'pointer', width: '100%' },
  toggleRow: { textAlign: 'center', marginTop: '5px' },
  linkLight: { fontSize: '13px', color: '#2563eb', cursor: 'pointer', textDecoration: 'underline' },
  linkDark: { fontSize: '13px', color: '#818cf8', cursor: 'pointer', textDecoration: 'underline' },
  switchTerminalBox: { borderTop: '1px solid #e5e7eb', marginTop: '25px', paddingTop: '20px', textAlign: 'center' },
  slideNextBtn: { background: 'none', border: '1px solid #b91c1c', borderColor: '#cbd5e1', padding: '11px 18px', borderRadius: '10px', fontWeight: 'bold', color: '#4b5563', fontSize: '13px', outline: 'none', cursor: 'pointer' },
  errorAlert: { padding: '12px', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', fontSize: '13px', borderRadius: '8px', textAlign: 'center', fontWeight: '500', marginBottom: '10px' }
};

export default IndexPortal;
