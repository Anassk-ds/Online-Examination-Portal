import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ examsConducted: 0, registeredStudents: 0 });
  const [submissions, setSubmissions] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [examTitle, setExamTitle] = useState('');
  const [startDate, setStartDate] = useState(''); 
  const [endDate, setEndDate] = useState('');   
  
  // This array holds all the questions you create dynamically
  const [questions, setQuestions] = useState([
    { type: 'mcq', text: '', optionA: '', optionB: '', optionC: '', optionD: '', correct: 'A', codingProblemStatement: '', allowedLanguages: ['javascript', 'python', 'java'] }
  ]);
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadAdminMetricsData = () => {
    Promise.all([
      fetch('/api/admin/dashboard').then(res => res.json()).catch(() => null),
      fetch('/api/student/results?email=').then(res => res.json()).catch(() => null)
    ])
    .then(([statsData, submissionData]) => {
      if (statsData) setStats(statsData.stats || statsData);
      if (submissionData && Array.isArray(submissionData)) setSubmissions(submissionData);
      setLoading(false);
    })
    .catch(() => setLoading(false));
  };

  useEffect(() => { 
    loadAdminMetricsData();

    // Safety net: don't let a slow/unreachable backend leave the panel
    // stuck on the loading screen forever. This used to be scheduled
    // inside the render body itself (a fresh setTimeout on every render
    // while `loading` was true), which is a React anti-pattern — it
    // fires as a side effect during render, and since it never gets
    // cleared it stacks up dozens of overlapping timers. Scheduling it
    // once here, on mount, with proper cleanup fixes that.
    const safetyTimer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(safetyTimer);
  }, []);

  const handleQuestionChange = (idx, field, val) => {
    const updated = [...questions];
    if (updated[idx]) {
      updated[idx][field] = val;
      setQuestions(updated);
    }
  };

  const handleLanguageCheckboxChange = (qIdx, lang) => {
    const updated = [...questions];
    if (updated[qIdx]) {
      const currentLangs = updated[qIdx].allowedLanguages || [];
      if (currentLangs.includes(lang)) {
        updated[qIdx].allowedLanguages = currentLangs.filter(l => l !== lang);
      } else {
        updated[qIdx].allowedLanguages = [...currentLangs, lang];
      }
      setQuestions(updated);
    }
  };

  const addQuestionField = (type = 'mcq') => {
    if (type === 'coding') {
      setQuestions([...questions, { type: 'coding', codingProblemStatement: '', allowedLanguages: ['javascript', 'python', 'java', 'cpp'] }]);
    } else {
      setQuestions([...questions, { type: 'mcq', text: '', optionA: '', optionB: '', optionC: '', optionD: '', correct: 'A' }]);
    }
  };

  const removeQuestionField = (idx) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handlePublishExam = async (e) => {
    e.preventDefault();
    setMessage(''); setError('');
    if (!examTitle.trim() || !startDate || !endDate) return setError("Please fill in all layout elements.");

    try {
      const res = await fetch('/api/admin/create-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: examTitle, startDate, endDate, questions })
      });
      if (!res.ok) throw new Error();
      setMessage("🏁 Exam configuration and question tracks successfully deployed live!");
      setExamTitle(''); setStartDate(''); setEndDate('');
      setQuestions([{ type: 'mcq', text: '', optionA: '', optionB: '', optionC: '', optionD: '', correct: 'A' }]);
      loadAdminMetricsData();
    } catch { 
      setError("Failed to communicate settings to backend ecosystem."); 
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  if (loading) return <div style={styles.loadingScreen}>🔄 Fetching Admin Control Metrics...</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h2 style={styles.title}>Cit Platform Control Center</h2>
          <p style={styles.subtitle}>Welcome back, Administrator</p>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>Sign Out</button>
      </header>

      <div style={styles.dashboardLayout}>
        {/* Left Creator Panel */}
        <div style={styles.creatorSide}>
          <div style={styles.panelCard}>
            <h3 style={styles.cardHeaderTitle}>🔨 Exam Creation Workshop</h3>
            <p style={styles.cardHeaderSubtitle}>Build text-based multi-choice items or multi-language code problems</p>

            {message && <div style={styles.successBox}>{message}</div>}
            {error && <div style={styles.errorBox}>{error}</div>}

            <form onSubmit={handlePublishExam} style={styles.form}>
              <div style={styles.inputRow}>
                <label style={styles.label}>Global Exam Session Title</label>
                <input 
                  type="text" 
                  value={examTitle} 
                  onChange={e => setExamTitle(e.target.value)} 
                  placeholder="e.g., Mid-Term Programming & Data Structures Exam" 
                  style={styles.textInput} 
                  required 
                />
              </div>

              <div style={styles.gridTwoColumns}>
                <div style={styles.inputRow}>
                  <label style={styles.label}>⏰ Activation Start Date</label>
                  <input type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)} style={styles.textInput} required />
                </div>
                <div style={styles.inputRow}>
                  <label style={styles.label}>🛑 Submission Cutoff Date</label>
                  <input type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)} style={styles.textInput} required />
                </div>
              </div>

              <div style={styles.questionsWrapper}>
                <h4 style={styles.sectionDivider}>Constructed Question Elements</h4>

                {questions.map((q, idx) => (
                  <div key={idx} style={styles.questionCard}>
                    <div style={styles.questionCardHeader}>
                      <span style={{
                        ...styles.typeBadge,
                        backgroundColor: q.type === 'coding' ? '#fee2e2' : '#e0e7ff',
                        color: q.type === 'coding' ? '#ef4444' : '#4f46e5',
                      }}>
                        {q.type === 'coding' ? `💻 CODING CHALLENGE #${idx + 1}` : `📝 MCQ ITEM #${idx + 1}`}
                      </span>
                      {questions.length > 1 && (
                        <button type="button" onClick={() => removeQuestionField(idx)} style={styles.removeBtn}>✕ Delete</button>
                      )}
                    </div>

                    {/* RENDER VIEW BASED ON TYPE */}
                    {q.type === 'coding' ? (
                      <div style={styles.fieldStack}>
                        <label style={styles.label}>Coding Prompt & Test Case Conditions</label>
                        <textarea 
                          rows="4" 
                          placeholder="Write problem text here. Example:&#10;Write a program to reverse a linked list.&#10;&#10;Input Format: [1, 2, 3]&#10;Output Format: [3, 2, 1]"
                          value={q.codingProblemStatement || ''}
                          onChange={e => handleQuestionChange(idx, 'codingProblemStatement', e.target.value)}
                          style={styles.textarea}
                          required
                        />
                        
                        <label style={styles.label}>Select Enabled Compilers:</label>
                        <div style={styles.checkboxGroup}>
                          {['javascript', 'python', 'java', 'cpp'].map(lang => (
                            <label key={lang} style={styles.checkboxLabel}>
                              <input 
                                type="checkbox" 
                                checked={(q.allowedLanguages || []).includes(lang)}
                                onChange={() => handleLanguageCheckboxChange(idx, lang)}
                              />
                              <span style={{ textTransform: 'uppercase', fontSize: '12px', fontWeight: 'bold' }}>{lang}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div style={styles.fieldStack}>
                        <label style={styles.label}>Multiple Choice Question Text</label>
                        <input 
                          type="text" 
                          placeholder="What is the time complexity of binary search?" 
                          value={q.text || ''} 
                          onChange={e => handleQuestionChange(idx, 'text', e.target.value)}
                          style={styles.textInput} 
                          required 
                        />

                        <div style={styles.gridTwoColumns}>
                          <input type="text" placeholder="Option A" value={q.optionA || ''} onChange={e => handleQuestionChange(idx, 'optionA', e.target.value)} style={styles.textInput} required />
                          <input type="text" placeholder="Option B" value={q.optionB || ''} onChange={e => handleQuestionChange(idx, 'optionB', e.target.value)} style={styles.textInput} required />
                          <input type="text" placeholder="Option C" value={q.optionC || ''} onChange={e => handleQuestionChange(idx, 'optionC', e.target.value)} style={styles.textInput} required />
                          <input type="text" placeholder="Option D" value={q.optionD || ''} onChange={e => handleQuestionChange(idx, 'optionD', e.target.value)} style={styles.textInput} required />
                        </div>

                        <div style={styles.dropdownRow}>
                          <label style={{ ...styles.label, margin: 0 }}>Designate Answer Selection:</label>
                          <select value={q.correct || 'A'} onChange={e => handleQuestionChange(idx, 'correct', e.target.value)} style={styles.select}>
                            <option value="A">Option A</option>
                            <option value="B">Option B</option>
                            <option value="C">Option C</option>
                            <option value="D">Option D</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* ACTION TOGGLES */}
              <div style={styles.actionBlock}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="button" onClick={() => addQuestionField('mcq')} style={styles.secondaryAddBtn}>➕ Add MCQ</button>
                  <button type="button" onClick={() => addQuestionField('coding')} style={{ ...styles.secondaryAddBtn, color: '#ef4444', borderColor: '#ef4444' }}>💻 Add Coding Track</button>
                </div>
                <button type="submit" style={styles.publishBtn}>🚀 Release Exam Configuration</button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Tracker Panel */}
        <div style={styles.trackerSide}>
          <div style={styles.panelCard}>
            <h3 style={styles.cardHeaderTitle}>📊 Live Tracking Records</h3>
            <p style={styles.cardHeaderSubtitle}>Real-time system state metrics of student results</p>

            {submissions.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '14px', textAlign: 'center', marginTop: '30px' }}>No student entry records parsed yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
                {submissions.map((sub, key) => (
                  <div key={key} style={styles.submissionRow}>
                    <div>
                      <h5 style={{ margin: '0 0 4px 0', color: '#1e293b', fontSize: '14px' }}>{sub.studentEmail}</h5>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>{sub.examTitle || 'Exam Submission'}</span>
                    </div>
                    <span style={styles.scoreBadge}>{sub.score ?? 'N/A'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Clean UI Stylesheet object
const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'system-ui, sans-serif' },
  loadingScreen: { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'system-ui, sans-serif', color: '#475569', fontSize: '16px' },
  header: { height: '75px', backgroundColor: '#0f172a', padding: '0 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff', borderBottom: '3px solid #3b82f6' },
  title: { fontSize: '18px', margin: 0, fontWeight: 'bold' },
  subtitle: { fontSize: '12px', color: '#94a3b8', margin: 0 },
  logoutBtn: { backgroundColor: '#334155', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
  dashboardLayout: { padding: '40px', maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '30px', flexWrap: 'wrap' },
  creatorSide: { flex: '3 1 600px' },
  trackerSide: { flex: '1.5 1 350px' },
  panelCard: { backgroundColor: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)' },
  cardHeaderTitle: { margin: '0 0 4px 0', color: '#0f172a', fontSize: '18px' },
  cardHeaderSubtitle: { margin: '0 0 24px 0', color: '#64748b', fontSize: '13px' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputRow: { display: 'flex', flexDirection: 'column', gap: '6px' },
  gridTwoColumns: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  label: { fontSize: '11px', fontWeight: 'bold', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.3px' },
  textInput: { padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', width: '100%', boxSizing: 'border-box', outline: 'none' },
  textarea: { padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', width: '100%', boxSizing: 'border-box', fontFamily: 'monospace', outline: 'none', resize: 'vertical' },
  questionsWrapper: { marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '20px' },
  sectionDivider: { fontSize: '12px', color: '#3b82f6', borderBottom: '2px dashed #e2e8f0', paddingBottom: '8px', margin: '0 0 10px 0', textTransform: 'uppercase' },
  questionCard: { padding: '20px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' },
  questionCardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  typeBadge: { fontSize: '10px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px' },
  removeBtn: { backgroundColor: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' },
  fieldStack: { display: 'flex', flexDirection: 'column', gap: '14px' },
  checkboxGroup: { display: 'flex', gap: '14px', flexWrap: 'wrap' },
  checkboxLabel: { display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', backgroundColor: '#fff', padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' },
  dropdownRow: { display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#fff', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' },
  select: { padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' },
  actionBlock: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' },
  publishBtn: { backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' },
  secondaryAddBtn: { backgroundColor: '#fff', color: '#475569', border: '1px solid #cbd5e1', padding: '8px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  submissionRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' },
  scoreBadge: { backgroundColor: '#dcfce7', color: '#16a34a', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' },
  successBox: { padding: '12px', backgroundColor: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: '6px', fontSize: '14px' },
  errorBox: { padding: '12px', backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '6px', fontSize: '14px' }
};

export default AdminPanel;
