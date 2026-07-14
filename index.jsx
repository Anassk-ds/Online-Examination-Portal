import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const IndexPortal = () => {
  const navigate = useNavigate();
  
  // 0 = Student Portal Active State, 1 = Admin Console Active State
  const [activePanel, setActivePanel] = useState(0);
  
  // Animation Phases: 'idle' (waiting), 'walking' (moving to center), 'arrived' (stopped at center)
  const [animPhase, setAnimPhase] = useState('idle');

  // Student Authentication Inputs
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [isStudentRegister, setIsStudentRegister] = useState(false);

  // Admin Authentication Inputs
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [masterAdminEmail, setMasterAdminEmail] = useState(''); 
  const [isAdminRegister, setIsAdminRegister] = useState(false);

  const [error, setError] = useState('');

  // Executes the exact sequence: Fade form out -> Walk to Center -> Stop & Transform -> Fade new form in
  const startWalkingSequence = (targetPanel) => {
    setError('');
    setAnimPhase('walking');

    // Step 2: Exactly at 1.4 seconds, the man arrives at the center and halts. 
    // The background color transforms instantly underneath him.
    setTimeout(() => {
      setAnimPhase('arrived');
      setActivePanel(targetPanel);
    }, 1400);

    // Step 3: Let him stand still at the center briefly before resetting back to standard layout
    setTimeout(() => {
      setAnimPhase('idle');
    }, 2400);
  };

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
      backgroundColor: activePanel === 0 ? '#f0fdf4' : '#0f172a'
    }}>
      
      {/* Injecting Live Walking and Bobbing Animation Sequences directly into the DOM */}
      <style>{`
        @keyframes dynamicBobbing {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-8px) rotate(-2deg); }
          75% { transform: translateY(-8px) rotate(2deg); }
        }
        @keyframes walkToCenterRight {
          0% { left: 10%; transform: scaleX(1); }
          100% { left: 50%; transform: scaleX(1) translateX(-50%); }
        }
        @keyframes walkToCenterLeft {
          0% { left: 90%; transform: scaleX(-1); }
          100% { left: 50%; transform: scaleX(-1) translateX(50%); }
        }
        
        .man-bobbing-loop {
          animation: dynamicBobbing 0.35s infinite ease-in-out;
        }
        .stage-walk-right {
          position: absolute;
          top: 30%;
          animation: walkToCenterRight 1.4s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .stage-walk-left {
          position: absolute;
          top: 30%;
          animation: walkToCenterLeft 1.4s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .stage-stopped-center {
          position: absolute;
          top: 30%;
          left: 50%;
          transform: translateX(-50%);
          transition: all 0.3s ease;
        }
        .fade-out-card {
          opacity: 0;
          transform: scale(0.95);
          pointer-events: none;
          transition: all 0.4s ease;
        }
        .fade-in-card {
          opacity: 1;
          transform: scale(1);
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>

      {/* ==========================================================================
         CINEMATIC ANIMATION STAGE
         ========================================================================== */}
      {animPhase !== 'idle' ? (
        <div style={styles.animationTrackLayer}>
          <div className={
            animPhase === 'walking' 
              ? (activePanel === 0 ? 'stage-walk-right' : 'stage-walk-left') 
              : 'stage-stopped-center'
          }>
            <div className={animPhase === 'walking' ? 'man-bobbing-loop' : ''}>
              {activePanel === 0 ? (
                /* STUDENT CHARACTER WALK VERSION */
                <svg width="240" height="240" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="100" cy="100" r="65" fill="#dcfce7" />
                  <path d="M75 160 C75 125, 125 125, 125 160" fill="#10b981" />
                  <circle cx="100" cy="90" r="24" fill="#fbcfe8" />
                  <path d="M78 82 C84 72, 116 72, 122 82 C112 76, 88 76, 78 82" fill="#1e293b" />
                  {/* Leg 1 */}
                  <rect x="88" y="160" width="8" height="25" rx="3" fill="#1e293b" />
                  {/* Leg 2 */}
                  <rect x="104" y="160" width="8" height="25" rx="3" fill="#1e293b" />
                  {/* Student Clipboard Form */}
                  <rect x="122" y="110" width="36" height="46" rx="4" fill="#ffffff" stroke="#10b981" strokeWidth="3"/>
                </svg>
              ) : (
                /* ADMIN CHARACTER WALK VERSION WITH OFFICE BAG */
                <svg width="240" height="240" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="100" cy="100" r="65" fill="#334155" />
                  <path d="M75 160 C75 125, 125 125, 125 160" fill="#4f46e5" />
                  <circle cx="100" cy="90" r="24" fill="#fed7aa" />
                  <path d="M78 82 C84 72, 116 72, 122 82 C112 76, 88 76, 78 82" fill="#451a03" />
                  <path d="M96 125 L104 125 L102 142 L98 142 Z" fill="#ef4444" />
                  {/* Leg 1 */}
                  <rect x="88" y="160" width="8" height="25" rx="3" fill="#0f172a" />
                  {/* Leg 2 */}
                  <rect x="104" y="160" width="8" height="25" rx="3" fill="#0f172a" />
                  {/* Office Portfolio Briefcase Bag */}
                  <rect x="122" y="122" width="44" height="32" rx="5" fill="#78350f" stroke="#f59e0b" strokeWidth="2"/>
                  <path d="M134 122 L134 116 C134 114, 154 114, 154 116 L154 122" stroke="#f59e0b" strokeWidth="2" fill="none"/>
                </svg>
              )}
            </div>
            <h2 style={{
              textAlign: 'center',
              marginTop: '10px',
              color: activePanel === 0 ? '#047857' : '#818cf8',
              fontFamily: 'sans-serif'
            }}>
              {animPhase === 'walking' ? 'Moving to Interface...' : 'Authorization Ready.'}
            </h2>
          </div>
        </div>
      ) : (
        
        /* ==========================================================================
           STANDARD SPLIT INTERFACE VIEWPORT
           ========================================================================== */
        <div style={styles.mainSplitGrid} className="fade-in-card">
          
          {/* LEFT COLUMN PANEL: STUDENT INTERFACE */}
          <div style={styles.panelSplitSide}>
            {activePanel === 0 && (
              <div style={styles.panelContentWrapper}>
                <div style={styles.graphicBox}>
                  <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="100" cy="100" r="65" fill="#dcfce7" />
                    <path d="M75 160 C75 125, 125 125, 125 160" fill="#10b981" />
                    <circle cx="100" cy="90" r="24" fill="#fbcfe8" />
                    <rect x="122" y="110" width="36" height="46" rx="4" fill="#ffffff" stroke="#10b981" strokeWidth="3"/>
                  </svg>
                  <h3 style={{ color: '#047857', margin: '10px 0 0 0' }}>Student Workspace</h3>
                </div>

                <div style={styles.card}>
                  <div style={styles.header}>
                    <h2 style={{ color: '#1f2937', margin: '0 0 5px 0' }}>Student Portal</h2>
                    <p style={{ color: '#6b7280', fontSize: '11px', margin: 0, textTransform: 'uppercase' }}>Online Examination Terminal</p>
                  </div>

                  {error && <div style={styles.errorAlert}>⚠️ {error}</div>}

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

                    <button type="submit" style={styles.studentBtn}>
                      {isStudentRegister ? 'Register Profile' : 'Secure Student Sign In'}
                    </button>

                    <div style={styles.toggleRow}>
                      <span onClick={() => setIsStudentRegister(!isStudentRegister)} style={styles.linkLight}>
                        {isStudentRegister ? 'Already have an account? Sign In' : 'New student? Register Here'}
                      </span>
                    </div>
                  </form>

                  <div style={styles.switchTerminalBox}>
                    <p style={{ fontSize: '12px', color: '#4b5563', margin: '0 0 8px 0' }}>Need administrative tools?</p>
                    <button type="button" onClick={() => startWalkingSequence(1)} style={styles.slideNextBtn}>
                      Slide to Admin Console ➔
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN PANEL: ADMIN INTERFACE */}
          <div style={styles.panelSplitSide}>
            {activePanel === 1 && (
              <div style={styles.panelContentWrapper}>
                <div style={styles.graphicBox}>
                  <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="100" cy="100" r="65" fill="#334155" />
                    <path d="M75 160 C75 125, 125 125, 125 160" fill="#4f46e5" />
                    <circle cx="100" cy="90" r="24" fill="#fed7aa" />
                    <path d="M96 125 L104 125 L102 142 L98 142 Z" fill="#ef4444" />
                    <rect x="122" y="122" width="44" height="32" rx="5" fill="#78350f" stroke="#f59e0b" strokeWidth="2"/>
                  </svg>
                  <h3 style={{ color: '#818cf8', margin: '10px 0 0 0' }}>Admin Console</h3>
                </div>

                <div style={{ ...styles.card, backgroundColor: '#1e293b', border: '1px solid #334155' }}>
                  <div style={styles.header}>
                    <h2 style={{ color: '#f8fafc', margin: '0 0 5px 0' }}>Admin Console</h2>
                    <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0, textTransform: 'uppercase' }}>Secure Infrastructure Access</p>
                  </div>

                  {error && <div style={styles.errorAlert}>⚠️ {error}</div>}

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
                        />
                      </div>
                    )}

                    <button type="submit" style={styles.adminBtn}>
                      {isAdminRegister ? 'Provision Master Credentials' : 'Access System Terminal'}
                    </button>

                    <div style={styles.toggleRow}>
                      <span onClick={() => setIsAdminRegister(!isAdminRegister)} style={styles.linkDark}>
                        {isAdminRegister ? 'Return to Standard Admin Login' : 'Register New Supervisor Instance'}
                      </span>
                    </div>
                  </form>

                  <div style={{ ...styles.switchTerminalBox, borderTop: '1px solid #334155' }}>
                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 8px 0' }}>Are you an academic student candidate?</p>
                    <button type="button" onClick={() => startWalkingSequence(0)} style={{ ...styles.slideNextBtn, color: '#cbd5e1', borderColor: '#4b5563' }}>
                      🪟 Return to Student Workspace View
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

const styles = {
  viewWindow: { 
    width: '100vw', 
    height: '100vh', 
    overflow: 'hidden', 
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'background-color 0.5s ease'
  },
  animationTrackLayer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: 10
  },
  mainSplitGrid: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  panelSplitSide: {
    flex: 1,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    boxSizing: 'border-box'
  },
  panelContentWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '50px',
    maxWidth: '900px',
    width: '100%',
    justifyContent: 'center'
  },
  graphicBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '260px'
  },
  card: { 
    padding: '35px 30px', 
    borderRadius: '20px', 
    backgroundColor: '#ffffff', 
    boxShadow: '0 20px 40px -15px rgba(0,0,0,0.08)', 
    border: '1px solid #e2e8f0', 
    width: '100%', 
    maxWidth: '420px', 
    boxSizing: 'border-box' 
  },
  header: { textAlign: 'center', marginBottom: '20px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  labelLight: { fontSize: '12px', fontWeight: 'bold', color: '#4b5563' },
  labelDark: { fontSize: '12px', fontWeight: 'bold', color: '#9ca3af' },
  lightInput: { padding: '12px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none', color: '#1f2937', width: '100%', boxSizing: 'border-box' },
  darkInput: { padding: '12px 14px', border: '1px solid #4b5563', borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: '#334155', color: '#fff', width: '100%', boxSizing: 'border-box' },
  studentBtn: { backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '13px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', width: '100%' },
  adminBtn: { backgroundColor: '#4f46e5', color: '#fff', border: 'none', padding: '13px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', width: '100%' },
  toggleRow: { textAlign: 'center', marginTop: '4px' },
  linkLight: { fontSize: '12px', color: '#2563eb', cursor: 'pointer', textDecoration: 'underline' },
  linkDark: { fontSize: '12px', color: '#818cf8', cursor: 'pointer', textDecoration: 'underline' },
  switchTerminalBox: { borderTop: '1px solid #e5e7eb', marginTop: '20px', paddingTop: '15px', textAlign: 'center' },
  slideNextBtn: { background: 'none', border: '1px solid #cbd5e1', padding: '10px 16px', borderRadius: '8px', fontWeight: 'bold', color: '#4b5563', fontSize: '12px', cursor: 'pointer' },
  errorAlert: { padding: '10px', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', fontSize: '12px', borderRadius: '6px', textAlign: 'center', marginBottom: '10px' }
};

export default IndexPortal;
