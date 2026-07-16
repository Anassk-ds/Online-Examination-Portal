import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './useTheme.js';
import { getUsers, saveUsers, getExams, saveExams, getResults } from './localData.js';

const emptyQuestion = () => ({
  type: 'mcq',
  text: '',
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  correct: 'A',
  codingProblemStatement: '',
  allowedLanguages: ['javascript', 'python', 'java']
});

const AdminPanel = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [stats, setStats] = useState({ totalExams: 0, approvedStudents: 0 });
  const [submissions, setSubmissions] = useState([]);
  const [pendingStudents, setPendingStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  const [examTitle, setExamTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [editingExamId, setEditingExamId] = useState(null);
  const [examToDelete, setExamToDelete] = useState(null);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadDashboardData = () => {
    const allExams = getExams();
    const allUsers = getUsers();
    const allResults = getResults();

    setExams(allExams);
    setStats({
      totalExams: allExams.length,
      approvedStudents: allUsers.filter((u) => u.role === 'student' && u.isApproved).length
    });
    setPendingStudents(allUsers.filter((u) => u.role === 'student' && !u.isApproved));
    setSubmissions(allResults);
    setLoading(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleApproveStudent = (studentId) => {
    const updated = getUsers().map((u) => (u.id === studentId ? { ...u, isApproved: true } : u));
    saveUsers(updated);
    loadDashboardData();
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, emptyQuestion()]);
  };

  const handleRemoveQuestion = (index) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setExamTitle('');
    setStartDate('');
    setEndDate('');
    setQuestions([emptyQuestion()]);
    setEditingExamId(null);
  };

  const handleSubmitExam = (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!examTitle.trim() || !startDate || !endDate) {
      setError('Please fill in the exam title and both dates.');
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      setError('End date must be after the start date.');
      return;
    }

    const allExams = getExams();

    if (editingExamId) {
      const updated = allExams.map((exam) =>
        exam._id === editingExamId
          ? { ...exam, title: examTitle, startDate: new Date(startDate).toISOString(), endDate: new Date(endDate).toISOString(), questions }
          : exam
      );
      saveExams(updated);
      setMessage('Exam updated successfully.');
    } else {
      const newExam = {
        _id: crypto.randomUUID(),
        title: examTitle,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        questions
      };
      saveExams([...allExams, newExam]);
      setMessage('Exam created successfully.');
    }

    resetForm();
    loadDashboardData();
  };

  const handleEditExam = (exam) => {
    setEditingExamId(exam._id);
    setExamTitle(exam.title);
    setStartDate(exam.startDate ? exam.startDate.slice(0, 16) : '');
    setEndDate(exam.endDate ? exam.endDate.slice(0, 16) : '');
    setQuestions(exam.questions && exam.questions.length ? exam.questions : [emptyQuestion()]);
    setMessage('');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmDelete = () => {
    if (!examToDelete) return;
    saveExams(getExams().filter((exam) => exam._id !== examToDelete));
    setExamToDelete(null);
    loadDashboardData();
  };

  const handleSignOut = () => {
    localStorage.clear();
    navigate('/');
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#475569' }}>Loading admin dashboard...</div>;

  return (
    <div className="admin-root page-fade-in">
      <div className="admin-navbar sidebar-fade-in">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Welcome back, Admin</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button onClick={toggleTheme} className="theme-toggle-btn btn-animated">
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <button onClick={handleSignOut} className="logout-btn btn-animated">Log Out</button>
        </div>
      </div>

      <div className="workspace-grid">

        {/* LEFT: Create / Edit exam form + Manage Exams table */}
        <div className="scroll-pane">
          <div className="panel-card">
            <h3 className="pane-heading">{editingExamId ? 'Edit Exam' : 'Create New Exam'}</h3>

            {message && <div className="alert-success">{message}</div>}
            {error && <div className="alert-error">{error}</div>}

            <form onSubmit={handleSubmitExam} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="field-group">
                <label className="field-label">Exam Title</label>
                <input
                  type="text"
                  placeholder="e.g., Data Structures Midterm"
                  value={examTitle}
                  onChange={e => setExamTitle(e.target.value)}
                  className="text-input input-animated"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="field-group">
                  <label className="field-label">Start Date & Time</label>
                  <input
                    type="datetime-local"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="text-input input-animated"
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">End Date & Time</label>
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="text-input input-animated"
                  />
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px', marginTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h4 style={{ margin: 0, fontSize: '15px' }}>Questions ({questions.length})</h4>
                  <button type="button" onClick={handleAddQuestion} className="add-question-btn btn-animated">
                    + Add Question
                  </button>
                </div>

                {questions.map((q, idx) => (
                  <div key={idx} className="question-card">
                    <div className="question-card-header">
                      <span className="question-number">Question {idx + 1}</span>
                      {questions.length > 1 && (
                        <button type="button" onClick={() => handleRemoveQuestion(idx)} className="remove-question-btn">
                          Remove
                        </button>
                      )}
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <div className="dropdown-row">
                        <span style={{ fontSize: '12px', color: '#64748b' }}>Question Type:</span>
                        <select
                          value={q.type}
                          onChange={e => handleQuestionChange(idx, 'type', e.target.value)}
                          className="select-input"
                        >
                          <option value="mcq">Multiple Choice</option>
                          <option value="coding">Coding</option>
                        </select>
                      </div>
                    </div>

                    <div className="field-group">
                      <label className="field-label">Question Text</label>
                      <textarea
                        rows={2}
                        placeholder="Enter the question or coding problem statement..."
                        value={q.text}
                        onChange={e => handleQuestionChange(idx, 'text', e.target.value)}
                        className="textarea-input input-animated"
                      />
                    </div>

                    {q.type === 'mcq' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px', borderTop: '1px dashed #e2e8f0', paddingTop: '12px' }}>
                        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>Answer Options:</span>
                        <div className="options-grid">
                          <input type="text" placeholder="Option A" value={q.optionA} onChange={e => handleQuestionChange(idx, 'optionA', e.target.value)} className="mini-input input-animated" />
                          <input type="text" placeholder="Option B" value={q.optionB} onChange={e => handleQuestionChange(idx, 'optionB', e.target.value)} className="mini-input input-animated" />
                          <input type="text" placeholder="Option C" value={q.optionC} onChange={e => handleQuestionChange(idx, 'optionC', e.target.value)} className="mini-input input-animated" />
                          <input type="text" placeholder="Option D" value={q.optionD} onChange={e => handleQuestionChange(idx, 'optionD', e.target.value)} className="mini-input input-animated" />
                        </div>
                        <div className="dropdown-row" style={{ marginTop: '5px' }}>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>Correct Answer:</span>
                          <select value={q.correct} onChange={e => handleQuestionChange(idx, 'correct', e.target.value)} className="select-input">
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div style={{ marginTop: '12px', borderTop: '1px dashed #e2e8f0', paddingTop: '12px', fontSize: '12px', color: '#64748b' }}>
                        Students will get a code editor for this question — no fixed answer options needed.
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="form-actions">
                <button type="submit" className="publish-btn btn-animated">
                  {editingExamId ? 'Save Changes' : 'Publish Exam'}
                </button>
                {editingExamId && (
                  <button type="button" onClick={resetForm} className="cancel-btn btn-animated">
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Manage Exams table */}
          <div className="panel-card">
            <h3 className="pane-heading">Manage Exams</h3>
            {exams.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>No exams created yet.</div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Questions</th>
                    <th>Closes</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {exams.map((exam) => (
                    <tr key={exam._id}>
                      <td>{exam.title}</td>
                      <td>{exam.questions?.length || 0}</td>
                      <td>{new Date(exam.endDate).toLocaleDateString()}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button onClick={() => handleEditExam(exam)} className="edit-btn btn-animated">Edit</button>
                        <button onClick={() => setExamToDelete(exam._id)} className="delete-btn btn-animated">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* RIGHT: stats + approvals + submissions */}
        <div className="scroll-pane">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="panel-card panel-card-blue">
              <span className="stat-label" style={{ color: '#1e3a8a' }}>TOTAL EXAMS</span>
              <div className="stat-value" style={{ color: '#1e40af' }}>{stats.totalExams}</div>
            </div>
            <div className="panel-card panel-card-green">
              <span className="stat-label" style={{ color: '#064e3b' }}>APPROVED STUDENTS</span>
              <div className="stat-value" style={{ color: '#065f46' }}>{stats.approvedStudents}</div>
            </div>
          </div>

          <div className="panel-card">
            <h3 className="pane-heading">Pending Student Approvals</h3>
            {pendingStudents.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>No students awaiting approval.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {pendingStudents.map((student) => (
                  <div key={student.id} className="list-row">
                    <div style={{ overflow: 'hidden', paddingRight: '10px' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#1e293b' }}>{student.name}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{student.email}</div>
                    </div>
                    <button onClick={() => handleApproveStudent(student.id)} className="approve-btn btn-animated">
                      Approve
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="panel-card">
            <h3 className="pane-heading">Recent Submissions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {submissions.length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>No submissions yet.</div>
              ) : (
                submissions.map((sub) => (
                  <div key={sub.id} className="list-row">
                    <div style={{ overflow: 'hidden', paddingRight: '10px' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#1e293b' }}>{sub.examTitle || 'Exam Attempt'}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{sub.studentEmail || 'Unknown student'}</div>
                    </div>
                    <span className="score-badge">{sub.score}/{sub.totalQuestions}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      {examToDelete && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h4 style={{ margin: '0 0 12px 0', color: '#0f172a' }}>Delete this exam?</h4>
            <p style={{ margin: '0 0 20px 0', color: '#64748b', fontSize: '14px' }}>
              This can't be undone. Students will no longer see this exam.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setExamToDelete(null)} className="cancel-btn btn-animated">Cancel</button>
              <button onClick={handleConfirmDelete} className="delete-btn btn-animated">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
