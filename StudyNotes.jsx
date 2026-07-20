import React, { useState, useEffect, useRef } from 'react';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setFormError('Title and content are both required.');
      return;
    }

    if (editingId) {
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

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(notes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'study-notes.json';
    a.click();
    URL.revokeObjectURL(url);
  };

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

  const filteredNotes = notes.filter((n) => {
    const term = searchTerm.toLowerCase();
    return (
      n.title.toLowerCase().includes(term) ||
      n.content.toLowerCase().includes(term) ||
      (n.examTitle || '').toLowerCase().includes(term)
    );
  });

  const emptyMessage = notes.length === 0 ? 'No notes yet — add your first one above.' : 'No notes match your search.';

  let notesListContent = null;
  if (filteredNotes.length === 0) {
    notesListContent = <div className="dash-empty-state">{emptyMessage}</div>;
  } else {
    notesListContent = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
        {filteredNotes.map((note) => {
          const isConfirmingDelete = confirmingDeleteId === note.id;
          let deleteControl = <button onClick={() => setConfirmingDeleteId(note.id)} className="note-icon-btn-danger">🗑️ Delete</button>;
          if (isConfirmingDelete) {
            deleteControl = (
              <div className="note-confirm-row">
                <span className="note-confirm-text">Delete?</span>
                <button onClick={() => handleConfirmDelete(note)} className="note-confirm-yes">Yes</button>
                <button onClick={() => setConfirmingDeleteId(null)} className="note-confirm-no">No</button>
              </div>
            );
          }

          return (
            <div key={note.id} className="note-card">
              <div className="note-card-header">
                <div>
                  <h4 className="note-title">{note.title}</h4>
                  {note.examTitle && <span className="note-exam-tag">{note.examTitle}</span>}
                </div>
                <div className="note-actions">
                  <button onClick={() => handleEditClick(note)} className="note-icon-btn">✏️ Edit</button>
                  {deleteControl}
                </div>
              </div>
              <p className="note-content">{note.content}</p>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="dash-section-card card-animated">
      <div className="notes-header-row">
        <h3 className="dash-section-title" style={{ margin: 0 }}>📝 My Study Notes</h3>
        <div className="notes-actions">
          <button onClick={handleExport} className="notes-small-btn btn-animated">⬇️ Export</button>
          <button onClick={() => fileInputRef.current?.click()} className="notes-small-btn btn-animated">⬆️ Import</button>
          <input ref={fileInputRef} type="file" accept="application/json" onChange={handleImportFile} style={{ display: 'none' }} />
        </div>
      </div>

      {undoNote && (
        <div className="notes-undo-bar">
          <span>Deleted "{undoNote.title}".</span>
          <button onClick={handleUndoDelete} className="notes-undo-btn">Undo</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="notes-form">
        {formError && <div className="alert-error">{formError}</div>}
        <input type="text" placeholder="Note title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="notes-input input-animated" />
        <input type="text" placeholder="Related exam (optional)" value={form.examTitle} onChange={(e) => setForm({ ...form, examTitle: e.target.value })} className="notes-input input-animated" />
        <textarea placeholder="Write your notes here..." value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="notes-textarea input-animated" rows={3} />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" className="notes-save-btn btn-animated">{editingId ? 'Save Changes' : '+ Add Note'}</button>
          {editingId && <button type="button" onClick={resetForm} className="notes-cancel-btn btn-animated">Cancel</button>}
        </div>
      </form>

      <input
        type="text"
        placeholder="🔍 Search notes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="notes-input input-animated"
        style={{ marginTop: '20px', marginBottom: '16px' }}
      />

      {notesListContent}

      {activity.length > 0 && (
        <div className="notes-activity-box">
          <h5 className="notes-activity-title">RECENT ACTIVITY</h5>
          {activity.map((a, idx) => (
            <div key={idx} className="notes-activity-item">{a.message} — {new Date(a.time).toLocaleString()}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudyNotes;
