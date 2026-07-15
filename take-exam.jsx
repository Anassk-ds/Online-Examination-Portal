import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLogin, saveExamProgress, getExamProgress, clearExamProgress } from './localData.js';

const TakeExam = () => {
  const { id: examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [restoredNotice, setRestoredNotice] = useState(false);

  const [localCode, setLocalCode] = useState('');
  const studentEmail = getLogin()?.email || localStorage.getItem('userEmail') || 'student@domain.com';

  useEffect(() => {
    if (!examId) {
      setError('⚠️ Invalid Exam reference mapping token. (Prop "examId" is missing or undefined)');
      setLoading(false);
      return;
    }

    fetch(`/api/student/exams/${examId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Exam not found or server structural error.');
        return res.json();
      })
      .then((data) => {
        if (data) {
          setExam(data);
          setQuestions(data.questions || []);

          const endTimestamp = new Date(data.endDate).getTime();
          const currentTimestamp = new Date().getTime();
          const remainingSeconds = Math.max(0, Math.floor((endTimestamp - currentTimestamp) / 1000));
          setTimeLeft(remainingSeconds);

          // Maintaining Data after Page Refresh: restore in-progress answers for this exam/session
          const saved = getExamProgress(examId);
          if (saved) {
            setAnswers(saved.answers || {});
            setCurrentIdx(saved.currentIdx || 0);
            setRestoredNotice(true);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to sync exam frame.');
        setLoading(false);
      });
  }, [examId]);

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      handleSubmitExamSheet();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (questions[currentIdx]) {
      const saved = answers[currentIdx];
      if (saved && typeof saved === 'object') {
        setLocalCode(saved.code || '');
      } else {
        setLocalCode('');
      }
    }
  }, [currentIdx, questions]);

  // Persist progress to Session Storage on every change (cleared automatically on submit or when the tab/session ends)
  useEffect(() => {
    if (!loading && examId && questions.length > 0) {
      saveExamProgress(examId, { answers, currentIdx });
    }
  }, [answers, currentIdx, loading, examId, questions.length]);

  const handleSelectOption = (optionLetter) => {
    setAnswers({
      ...answers,
      [currentIdx]: optionLetter
    });
  };

  const handleCodeChange = (val) => {
    setLocalCode(val);
    const currentQuestion = questions[currentIdx];
    const chosenLang = answers[currentIdx]?.lang || (currentQuestion?.allowedLanguages?.[0] || 'javascript');
    
    setAnswers({
      ...answers,
      [currentIdx]: {
        lang: chosenLang,
        code: val
      }
    });
  };

  const handleLanguageSelect = (lang) => {
    setAnswers({
      ...answers,
      [currentIdx]: {
        lang: lang,
        code: localCode
      }
    });
  };

  const handleSubmitExamSheet = () => {
    if (submitting) return;
    setSubmitting(true);

    fetch('/api/student/submit-exam', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: studentEmail,
        examId: examId,
        examTitle: exam?.title || 'Exam Assessment',
        answers: answers
      })
    })
    .then((res) => {
      if (!res.ok) throw new Error('Failed to transmit score matrices.');
      return res.json();
    })
    .then(() => {
      clearExamProgress(examId); // exam is done — no need to keep session draft
      alert('🎉 Assessment submitted successfully!');
      navigate('/dashboard');
    })
    .catch((err) => {
      alert(`⚠️ Submission Error: ${err.message}`);
      setSubmitting(false);
    });
  };

  const formatTimerString = (seconds) => {
    if (seconds === null) return '--:--';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) return <div style={{ padding: '40px', backgroundColor: '#0f172a', color: '#94a3b8', height: '100vh', textAlign: 'center' }}>🔄 Securing Exam Workspace Tunnel...</div>;
  if (error) return <div style={{ padding: '40px', backgroundColor: '#0f172a', color: '#ef4444', height: '100vh', textAlign: 'center' }}>{error}</div>;

  const activeQuestion = questions[currentIdx];

  return (
    <div style={styles.examViewportFrame} className="page-fade-in">
      {/* Top Banner Control Track */}
      <div style={styles.examTopNavbar}>
        <div>
          <h2 style={{ margin: 0, fontSize: '18px', color: '#f8fafc' }}>{exam?.title}</h2>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>Session Candidate Profile: {studentEmail}</span>
          {restoredNotice && (
            <span style={{ marginLeft: '12px', fontSize: '11px', color: '#34d399' }}>✓ Restored your progress from this session</span>
          )}
        </div>
        <div style={styles.timerBadgeContainer}>
          <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>Remaining Duration Clock:</span>
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: timeLeft < 300 ? '#ef4444' : '#10b981' }}>{formatTimerString(timeLeft)}</span>
        </div>
      </div>

      {/* Primary Split Viewport Box */}
      <div style={styles.mainSplitLayoutWindow}>
        {/* Left Hand Navigation Grid Panel */}
        <div style={styles.sidebarQuestionTracker} className="sidebar-fade-in">
          <h4 style={{ margin: '0 0 15px 0', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase' }}>Items Checklist Matrix</h4>
          <div style={styles.numericalIndicatorGrid}>
            {questions.map((_, idx) => {
              const isVisited = answers[idx] !== undefined;
              const isActive = idx === currentIdx;

              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIdx(idx)}
                  style={{
                    ...styles.gridIdxBtn,
                    backgroundColor: isActive ? '#3b82f6' : isVisited ? '#1e293b' : '#0f172a',
                    borderColor: isActive ? '#60a5fa' : '#334155',
                    color: isActive ? '#ffffff' : isVisited ? '#3b82f6' : '#64748b'
                  }}
                  className="btn-animated"
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Hand Question Panel Container */}
        <div style={styles.questionWorkspaceViewport}>
          {activeQuestion ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={styles.questionMetaHeaderRow}>
                <span style={{ padding: '4px 10px', backgroundColor: '#1e293b', borderRadius: '4px', fontSize: '12px', color: '#3b82f6', fontWeight: 'bold' }}>
                  QUESTION COMPONENT #{currentIdx + 1} ({activeQuestion.type?.toUpperCase()})
                </span>
              </div>

              <div style={styles.problemStatementContainerCard}>
                <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{activeQuestion.text}</p>
              </div>

              {/* MULTIPLE CHOICE TYPE SELECTOR BLOCKS */}
              {activeQuestion.type === 'mcq' && (
                <div style={styles.optionsListGrid}>
                  {['A', 'B', 'C', 'D'].map((letter) => {
                    const optionText = activeQuestion[`option${letter}`];
                    const isSelected = answers[currentIdx] === letter;

                    return (
                      <button
                        key={letter}
                        onClick={() => handleSelectOption(letter)}
                        style={{
                          ...styles.optionRowBtn,
                          backgroundColor: isSelected ? '#1e3a8a' : '#1e293b',
                          borderColor: isSelected ? '#3b82f6' : '#334155'
                        }}
                        className="mcq-option-animated"
                      >
                        <span style={{
                          ...styles.optionSelectorLetter,
                          backgroundColor: isSelected ? '#3b82f6' : '#0f172a',
                          color: isSelected ? '#ffffff' : '#94a3b8'
                        }}>{letter}</span>
                        <span style={styles.optionStringValue}>{optionText}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* COMPLEX LAB WORKSPACE COMPILER PANEL */}
              {activeQuestion.type === 'coding' && (
                <div style={styles.codingWorkspaceModule}>
                  <div style={{ padding: '15px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '13px', color: '#94a3b8' }}>🔒 Problem Context: Fill in missing implementation blocks below</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>Target Compiler:</span>
                      <select
                        value={answers[currentIdx]?.lang || activeQuestion.allowedLanguages?.[0] || 'javascript'}
                        onChange={(e) => handleLanguageSelect(e.target.value)}
                        style={styles.languageDropdownMenu}
                        className="input-animated"
                      >
                        {(activeQuestion.allowedLanguages || ['javascript', 'python', 'java']).map((lang) => (
                          <option key={lang} value={lang}>{lang.toUpperCase()}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div style={styles.editorFlexAreaBox}>
                    <textarea
                      value={localCode}
                      onChange={(e) => handleCodeChange(e.target.value)}
                      placeholder="// Insert clean modular execution logic paths here..."
                      style={styles.codeTextareaField}
                      className="input-animated"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>No question structure is mapped onto this specific index panel slot.</div>
          )}
        </div>
      </div>

      {/* Bottom Control Actions Ribbon */}
      <div style={styles.examFooter}>
        <button
          onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
          disabled={currentIdx === 0}
          style={{ ...styles.navActionBtn, opacity: currentIdx === 0 ? 0.4 : 1 }}
          className="btn-animated"
        >
          ◀ Previous Question
        </button>

        {currentIdx < questions.length - 1 ? (
          <button
            onClick={() => setCurrentIdx(currentIdx + 1)}
            style={styles.nextStepBtn}
            className="btn-animated"
          >
            Advance Next Item ▶
          </button>
        ) : (
          <button
            onClick={handleSubmitExamSheet}
            disabled={submitting}
            style={{ ...styles.nextStepBtn, backgroundColor: '#10b981' }}
            className="btn-animated"
          >
            {submitting ? 'Transmitting Core Manifest...' : '🔒 Submit Verified Answer Sheet'}
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  examViewportFrame: { width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0f172a', color: '#e2e8f0', fontFamily: 'sans-serif', overflow: 'hidden' },
  examTopNavbar: { height: '70px', backgroundColor: '#111827', borderBottom: '1px solid #334155', padding: '0 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  timerBadgeContainer: { display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#1e293b', padding: '8px 16px', borderRadius: '8px', border: '1px solid #334155' },
  mainSplitLayoutWindow: { flex: 1, display: 'flex', overflow: 'hidden' },
  sidebarQuestionTracker: { width: '250px', backgroundColor: '#111827', borderRight: '1px solid #334155', padding: '20px', overflowY: 'auto' },
  numericalIndicatorGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' },
  gridIdxBtn: { height: '40px', borderRadius: '6px', border: '1px solid', fontWeight: 'bold', fontSize: '14px', outline: 'none' },
  questionWorkspaceViewport: { flex: 1, backgroundColor: '#0f172a', padding: '30px', overflowY: 'auto' },
  questionMetaHeaderRow: { marginBottom: '15px' },
  problemStatementContainerCard: { backgroundColor: '#111827', border: '1px solid #334155', padding: '20px', borderRadius: '8px', fontSize: '16px', color: '#f8fafc', marginBottom: '25px' },
  optionsListGrid: { display: 'flex', flexDirection: 'column', gap: '12px' },
  optionRowBtn: { display: 'flex', alignItems: 'center', padding: '14px', borderRadius: '8px', border: '1px solid #334155', cursor: 'pointer', textAlign: 'left', outline: 'none' },
  optionSelectorLetter: { width: '30px', height: '30px', borderRadius: '6px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', marginRight: '15px' },
  optionStringValue: { color: '#e2e8f0', fontSize: '15px' },
  codingWorkspaceModule: { display: 'flex', flexDirection: 'column', backgroundColor: '#111827', border: '1px solid #334155', borderRadius: '8px', flex: 1, minHeight: '350px' },
  languageDropdownMenu: { backgroundColor: '#0f172a', color: '#f8fafc', border: '1px solid #334155', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', outline: 'none' },
  editorFlexAreaBox: { flex: 1, display: 'flex' },
  codeTextareaField: { flex: 1, backgroundColor: '#0f172a', color: '#34d399', fontFamily: 'monospace', fontSize: '14px', padding: '15px', border: 'none', outline: 'none', resize: 'none' },
  examFooter: { height: '75px', backgroundColor: '#111827', borderTop: '1px solid #334155', padding: '0 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  navActionBtn: { backgroundColor: '#1e293b', color: '#94a3b8', border: '1px solid #334155', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' },
  nextStepBtn: { backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', padding: '10px 22px', borderRadius: '6px', cursor: 'pointer' }
};

export default TakeExam;
