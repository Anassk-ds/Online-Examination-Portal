import React, { useState, useEffect, useRef } from 'react';

// Day-45 assignment: Local Storage CRUD + Session Storage, scoped to a
// genuinely useful feature for an exam portal — students keeping personal
// revision notes, per exam or general, that persist across refresh.

const notesKey = (email) => `studyNotes:${email}`;
const activityKey = (email) => `studyNotesActivity:${email}`;
const SEARCH_SESSION_KEY = 'studyNotesSearchTerm';

const loadNotes = (email) => {
  try {
    const raw = localStorage.getItem(notesKey(email));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const loadActivity = (email) => {
  try {
    const raw = localStorage.getItem(activityKey(email));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const logActivity = (email, message) => {
  const existing = loadActivity(email);
  const updated = [{ message, time: new Date().toISOString() }, ...existing].slice(0, 10);
  localStorage.setItem(activityKey(email), JSON.stringify(updated));
  return updated;
};

const StudyNotes = ({ studentEmail }) => {
  const [notes, setNotes] = useState(() => loadNotes(studentEmail));
  const [activity, setActivity] = useState(() => loadActivity(studentEmail));

  // Module 4 (Session Storage): the search term only lives for this browser
  // session — it resets once the tab/browser is closed, unlike notes
  // themselves which persist indefinitely in Local Storage.
  const [searchTerm, setSearchTerm] = useState(() => sessionStorage.getItem(SEARCH_SESSION_KEY) || '');

  const [form, setForm] = useState({ title: '', content: '', examTitle: '' });
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState('');
  const [confirmingDeleteId, setConfirmingDeleteId] = useState(null);
  const [undoNote, setUndoNote] = useState(null);
  const undoTimerRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(notesKey(studentEmail), JSON.stringify(notes));
  }, [notes, studentEmail]);

  useEffect(() => {
    sessionStorage.setItem(SEARCH_SESSION_KEY, searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    return () => { if (undoTimerRef.current) clearTimeout(undoTimerRef.current); };
  }, []);

  const resetForm = () => {
    setForm({ title: '', content: '', examTitle: '' });
    setEditingId(null);
    setFormError('');
  };

  // Module 5 — Create
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setFormError('Title and notes content are both required.');
      return;
    }

    if (editingId) {
      // Module 6 — Update
      setNotes((prev) => prev.map((n) => (n.id === editingId ? { ...n, ...form, updatedAt: new Date().toISOString() } : n)));
      setActivity(logActivity(studentEmail, `Edited note "${form.title}"`));
    } else {
      const newNote = { id: crypto.randomUUID(), ...form, createdAt: new Date().toISOString() };
      setNotes((prev) => [newNote, ...prev]);
      setActivity(logActivity(studentEmail, `Added note "${form.title}"`));
    }
    resetForm();
  };

  const handleEditClick = (note) => {
    setEditingId(note.id);
    setForm({ title: note.title, content: note.content, examTitle: note.examTitle || '' });
    setFormError('');
  };

  // Module 7 — Delete (with confirmation + Bonus 2: Undo Delete)
  const handleConfirmDelete = (note) => {
    setNotes((prev) => prev.filter((n) => n.id !== note.id));
    setActivity(logActivity(studentEmail, `Deleted note "${note.title}"`));
    setConfirmingDeleteId(null);

    setUndoNote(note);
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    undoTimerRef.current = setTimeout(() => setUndoNote(null), 6000);
  };

  const handleUndoDelete = () => {
    if (!undoNote) return;
    setNotes((prev) => [undoNote, ...prev]);
    setActivity(logActivity(studentEmail, `Restored note "${undoNote.title}"`));
    setUndoNote(null);
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
  };

  // Bonus 3 — Export as JSON
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(notes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'study-notes.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Bonus 3 — Import from JSON
  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (!Array.isArray(imported)) throw new Error('Invalid file format.');
        setNotes((prev) => [...imported, ...prev]);
        setActivity(logActivity(studentEmail, `Imported ${imported.length} note(s)`));
      } catch {
        setFormError('Could not import — the file is not valid JSON note data.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Bonus 1 — Search & Filter
  const filteredNotes = notes.filter((n) => {
    const term = searchTerm.toLowerCase();
    return (
      n.title.toLowerCase().includes(term) ||
      n.content.toLowerCase().includes(term) ||
      (n.examTitle || '').toLowerCase().includes(term)
    );
  });

  return (
    <div style={styles.sectionAreaCard}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
        <h3 style={styles.sectionCardTitle}>📝 My Study Notes</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleExport} style={styles.smallBtn}>⬇️ Export JSON</button>
          <button onClick={() => fileInputRef.current?.click()} style={styles.smallBtn}>⬆️ Import JSON</button>
          <input ref={fileInputRef} type="file" accept="application/json" onChange={handleImportFile} style={{ display: 'none' }} />
        </div>
      </div>

      {undoNote && (
        <div style={styles.undoBar}>
          <span>Deleted "{undoNote.title}".</span>
          <button onClick={handleUndoDelete} style={styles.undoBtn}>Undo</button>
        </div>
      )}

      {/* Create / Edit form */}
      <form onSubmit={handleSubmit} style={styles.form}>
        {formError && <div style={styles.errorAlert}>⚠️ {formError}</div>}
        <input
          type="text"
          placeholder="Note title (e.g. Java OOP concepts)"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Related exam (optional)"
          value={form.examTitle}
          onChange={(e) => setForm({ ...form, examTitle: e.target.value })}
          style={styles.input}
        />
        <textarea
          placeholder="Write your notes here..."
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          style={styles.textarea}
          rows={3}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" style={styles.saveBtn}>{editingId ? 'Save Changes' : '+ Add Note'}</button>
          {editingId && <button type="button" onClick={resetForm} style={styles.cancelBtn}>Cancel</button>}
        </div>
      </form>

      {/* Search (Bonus 1, backed by Session Storage) */}
      <input
        type="text"
        placeholder="🔍 Search notes by title, exam, or content..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ ...styles.input, marginTop: '20px', marginBottom: '16px' }}
      />

      {/* Notes list (Module 8: dynamic cards) */}
      {filteredNotes.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
          {notes.length === 0 ? 'No notes yet — add your first one above.' : 'No notes match your search.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {filteredNotes.map((note) => (
            <div key={note.id} style={styles.noteCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', color: '#0f172a', fontSize: '15px' }}>{note.title}</h4>
                  {note.examTitle && <span style={styles.examTag}>{note.examTitle}</span>}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleEditClick(note)} style={styles.iconBtn}>✏️ Edit</button>
                  {confirmingDeleteId === note.id ? (
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: '#dc2626' }}>Delete?</span>
                      <button onClick={() => handleConfirmDelete(note)} style={styles.confirmYesBtn}>Yes</button>
                      <button onClick={() => setConfirmingDeleteId(null)} style={styles.confirmNoBtn}>No</button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmingDeleteId(note.id)} style={styles.iconBtnDanger}>🗑️ Delete</button>
                  )}
                </div>
              </div>
              <p style={{ margin: '10px 0 0 0', fontSize: '13px', color: '#475569', whiteSpace: 'pre-wrap' }}>{note.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Bonus 5 — Recent Activity */}
      {activity.length > 0 && (
        <div style={styles.activityBox}>
          <h5 style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#64748b', fontWeight: 'bold' }}>RECENT ACTIVITY</h5>
          {activity.map((a, idx) => (
            <div key={idx} style={{ fontSize: '12px', color: '#94a3b8', padding: '4px 0' }}>
              {a.message} — <span>{new Date(a.time).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  sectionAreaCard: { backgroundColor: 'var(--surface)', color: 'var(--text)', padding: '30px', borderRadius: '16px', border: '1px solid var(--border)' },
  sectionCardTitle: { fontSize: '18px', margin: 0, color: 'var(--text)', fontWeight: '700' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  input: { padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px' },
  textarea: { padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', fontFamily: 'sans-serif', resize: 'vertical' },
  saveBtn: { backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  cancelBtn: { backgroundColor: '#e2e8f0', color: '#334155', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  smallBtn: { backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' },
  noteCard: { padding: '16px', border: '1px solid #e2e8f0', borderRadius: '10px', backgroundColor: '#f8fafc' },
  examTag: { fontSize: '11px', backgroundColor: '#e0e7ff', color: '#4338ca', padding: '3px 8px', borderRadius: '12px' },
  iconBtn: { backgroundColor: '#fff', border: '1px solid #cbd5e1', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' },
  iconBtnDanger: { backgroundColor: '#fff', border: '1px solid #fecaca', color: '#dc2626', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' },
  confirmYesBtn: { backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' },
  confirmNoBtn: { backgroundColor: '#e2e8f0', color: '#334155', border: 'none', padding: '5px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' },
  undoBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e293b', color: '#fff', padding: '10px 16px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' },
  undoBtn: { backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' },
  errorAlert: { backgroundColor: '#fef2f2', border: '1px solid #fee2e2', color: '#dc2626', padding: '10px', borderRadius: '6px', fontSize: '13px' },
  activityBox: { borderTop: '1px solid #e2e8f0', paddingTop: '16px' }
};

export default StudyNotes;

