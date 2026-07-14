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
  }, []);

  const handleQuestionFieldUpdate = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleAddNewQuestionRow = () => {
    setQuestions([
      ...questions,
      { type: 'mcq', text: '', optionA: '', optionB: '', optionC: '', optionD: '', correct: 'A', codingProblemStatement: '', allowedLanguages: ['javascript', 'python', 'java'] }
    ]);
  };

  const handleRemoveQuestionRow = (index) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleCreateNewExamManifest = (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!examTitle.trim() || !startDate || !endDate) {
      return setError('Please configure all essential baseline metadata tracking bounds.');
    }

    const compiledExamObject = {
      title: examTitle,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      questions: questions
    };

    fetch('/api/admin/create-exam', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(compiledExamObject)
    })
    .then((res) => {
      if (!res.ok) throw new Error('Failed to authorize operational deployment parameters.');
      return res.json();
    })
    .then(() => {
      setMessage('🎉 Structural assessment packet assembled and pushed to production registries successfully.');
      setExamTitle('');
      setStartDate('');
      setEndDate('');
      setQuestions([{ type: 'mcq', text: '', optionA: '', optionB: '', optionC: '', optionD: '', correct: 'A', codingProblemStatement: '', allowedLanguages: ['javascript', 'python', 'java'] }]);
      loadAdminMetricsData();
    })
    .catch((err) => setError(err.message));
  };

  const handleSignOut = () => {
    localStorage.clear();
    navigate('/');
  };

  if (loading) return <div style={{ padding: '40px', fontFamily: 'sans-serif', color: '#475569', textAlign: 'center' }}>🔄 Querying live supervisor databanks...</div>;

  return (
    <div style={styles.viewRoot} className="page-fade-in">
      {/* Structural Admin Control Header Panel */}
      <div style={styles.navbarTop} className="sidebar-fade-in">
        <div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold' }}>🛡️ Infrastructure Control Center</h1>
          <p style={{ margin: '2px 0 0 0', color: '#94a3b8', fontSize: '12px' }}>Operational Authority Layer Node Active</p>
        </div>
        <button onClick={handleSignOut} style={styles.logoutActionBtn} className="btn-animated">Disconnect Console Session</button>
      </div>

      <div style={styles.workspaceSplitGrid}>
        
        {/* LEFT HAND SCHEDULER MATRIX FORM FRAME */}
        <div style={styles.scrollColumnPane} className="card-animated">
          <div style={styles.panelCard}>
            <h3 style={styles.paneSectionHeading}>📝 Provision New Examination Matrix</h3>
            
            {message && <div style={styles.successMessageRow}>✓ {message}</div>}
            {error && <div style={styles.errorMessageRow}>⚠️ {error}</div>}

            <form onSubmit={handleCreateNewExamManifest} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={styles.inputStackField}>
                <label style={styles.fieldLabel}>Global Assessment Descriptive Title</label>
                <input 
                  type="text" 
                  placeholder="e.g., Advanced Algorithmic Complexity Evaluation" 
                  value={examTitle}
                  onChange={e => setExamTitle(e.target.value)}
                  style={styles.textInputBox}
                  className="input-animated"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={styles.inputStackField}>
                  <label style={styles.fieldLabel}>Opening Gateway Date/Time</label>
                  <input 
                    type="datetime-local" 
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    style={styles.textInputBox}
                    className="input-animated"
                  />
                </div>
                <div style={styles.inputStackField}>
                  <label style={styles.fieldLabel}>Absolute Closing Deadline</label>
                  <input 
                    type="datetime-local" 
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    style={styles.textInputBox}
                    className="input-animated"
                  />
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px', marginTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h4 style={{ margin: 0, color: '#1e293b', fontSize: '15px' }}>Questions Inventory Stack ({questions.length})</h4>
                  <button type="button" onClick={handleAddNewQuestionRow} style={styles.secondaryAddBtn} className="btn-animated">
                    ➕ Append Question Block
                  </button>
                </div>

                {questions.map((q, idx) => (
                  <div key={idx} style={styles.dynamicQuestionContainerCard} className="card-animated">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '13px', color: '#2563eb' }}>Item Entity Element #{idx + 1}</span>
                      {questions.length > 1 && (
                        <button type="button" onClick={() => handleRemoveQuestionRow(idx)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }} className="btn-animated">
                          [❌ Drop Item Row]
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                      <div style={styles.dropdownRow}>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>Structural Class Type:</span>
                        <select 
                          value={q.type} 
                          onChange={e => handleQuestionFieldUpdate(idx, 'type', e.target.value)}
                          style={styles.select}
                          className="input-animated"
                        >
                          <option value="mcq">Multiple Choice Question (MCQ)</option>
                          <option value="coding">Lab Programming Compiler (Coding)</option>
                        </select>
                      </div>
                    </div>

                    <div style={styles.inputStackField}>
                      <label style={styles.fieldLabel}>Problem Context Statement Prompt</label>
                      <textarea 
                        rows={2}
                        placeholder="Define item specifications or coding question logic arrays..."
                        value={q.text}
                        onChange={e => handleQuestionFieldUpdate(idx, 'text', e.target.value)}
                        style={styles.textareaField}
                        className="input-animated"
                      />
                    </div>

                    {q.type === 'mcq' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px', borderTop: '1px dashed #e2e8f0', paddingTop: '12px' }}>
                        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>Option Targets Array Configuration:</span>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          <input type="text" placeholder="Option A String" value={q.optionA} onChange={e => handleQuestionFieldUpdate(idx, 'optionA', e.target.value)} style={styles.miniTextInput} className="input-animated" />
                          <input type="text" placeholder="Option B String" value={q.optionB} onChange={e => handleQuestionFieldUpdate(idx, 'optionB', e.target.value)} style={styles.miniTextInput} className="input-animated" />
                          <input type="text" placeholder="Option C String" value={q.optionC} onChange={e => handleQuestionFieldUpdate(idx, 'optionC', e.target.value)} style={styles.miniTextInput} className="input-animated" />
                          <input type="text" placeholder="Option D String" value={q.optionD} onChange={e => handleQuestionFieldUpdate(idx, 'optionD', e.target.value)} style={styles.miniTextInput} className="input-animated" />
                        </div>
                        <div style={{ ...styles.dropdownRow, marginTop: '5px' }}>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>Correct Targeted Key Choice Flag:</span>
                          <select value={q.correct} onChange={e => handleQuestionFieldUpdate(idx, 'correct', e.target.value)} style={styles.select} className="input-animated">
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div style={{ marginTop: '12px', borderTop: '1px dashed #e2e8f0', paddingTop: '12px', fontSize: '12px', color: '#64748b' }}>
                        ℹ️ Lab Programming question block active. Standard input hooks drive text compilation frameworks inside the exam room views automatically.
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div style={styles.actionBlock}>
                <button type="submit" style={styles.publishBtn} className="btn-animated">
                  🚀 Synchronize Assessment Frame to Production Core
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT HAND ANALYTICS LOGGER STREAMER COLUMN */}
        <div style={styles.scrollColumnPane} className="card-animated">
          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
            <div style={{ ...styles.panelCard, backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }} className="card-animated">
              <span style={{ fontSize: '11px', color: '#1e3a8a', fontWeight: 'bold' }}>EXAMS ACTIVE REGISTRY COUNT</span>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e40af', marginTop: '5px' }}>{stats.examsConducted} Packets</div>
            </div>
            <div style={{ ...styles.panelCard, backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0' }} className="card-animated">
              <span style={{ fontSize: '11px', color: '#064e3b', fontWeight: 'bold' }}>REGISTERED STUDENT PROFILES</span>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#065f46', marginTop: '5px' }}>{stats.registeredStudents} Nodes</div>
            </div>
          </div>

          {/* Submissions Feed */}
          <div style={styles.panelCard}>
            <h3 style={styles.paneSectionHeading}>📊 Real-time Stream Analytics Feed Logs</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {submissions.length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>No student answers maps synced inside active transaction storage records yet.</div>
              ) : (
                submissions.map((sub) => (
                  <div key={sub._id} style={styles.submissionRow} className="card-animated">
                    <div style={{ overflow: 'hidden', paddingRight: '10px' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#1e293b' }}>{sub.examTitle || 'Exam Attempt'}</div>
                      <div style={{ fontSize: '11px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Identity Profile Key: {sub.studentEmail || 'Unknown'}</div>
                    </div>
                    <span style={styles.scoreBadge}>✓ Verified Transmitted Packets</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const styles = {
  viewRoot: { width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc', fontFamily: 'sans-serif', overflow: 'hidden' },
  navbarTop: { height: '75px', backgroundColor: '#0f172a', color: '#fff', padding: '0 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b' },
  logoutActionBtn: { backgroundColor: '#334155', color: '#cbd5e1', border: 'none', padding: '10px 16px', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px', outline: 'none' },
  workspaceSplitGrid: { flex: 1, display: 'grid', gridTemplateColumns: '1.2fr 1fr', overflow: 'hidden' },
  scrollColumnPane: { padding: '30px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' },
  panelCard: { backgroundColor: '#fff', border: '1px solid #e2e8f0', padding: '24px', borderRadius: '12px' },
  paneSectionHeading: { margin: '0 0 20px 0', fontSize: '16px', color: '#0f172a', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' },
  inputStackField: { display: 'flex', flexDirection: 'column', gap: '6px' },
  fieldLabel: { fontSize: '12px', fontWeight: 'bold', color: '#475569' },
  textInputBox: { padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', outline: 'none', color: '#1e293b' },
  textareaField: { padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', outline: 'none', color: '#1e293b', fontFamily: 'sans-serif', resize: 'vertical' },
  dynamicQuestionContainerCard: { backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginBottom: '15px' },
  miniTextInput: { padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', outline: 'none' },
  dropdownRow: { display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#fff', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' },
  select: { padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' },
  actionBlock: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' },
  publishBtn: { backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', outline: 'none', width: '100%' },
  secondaryAddBtn: { backgroundColor: '#fff', color: '#475569', border: '1px solid #cbd5e1', padding: '8px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', outline: 'none' },
  submissionRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' },
  scoreBadge: { backgroundColor: '#dcfce7', color: '#16a34a', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' },
  successMessageRow: { padding: '12px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', borderRadius: '6px', fontSize: '13px', marginBottom: '15px' },
  errorMessageRow: { padding: '12px', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', borderRadius: '6px', fontSize: '13px', marginBottom: '15px' }
};

export default AdminPanel;
