import React, { useState } from 'react';
import { changePassword } from './apiClient.js';
import { FiX, FiCheckCircle } from 'react-icons/fi';

// Drop <ChangePasswordModal onClose={...} /> anywhere behind a trigger
// button. Works for both students and admins — it reads whichever email is
// currently logged in from localStorage, so no props are required.
const ChangePasswordModal = ({ onClose }) => {
  const email = localStorage.getItem('userEmail') || '';

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!currentPassword.trim() || !newPassword.trim()) {
      return setError('Please fill in all fields.');
    }
    if (newPassword.length < 6) {
      return setError('New password must be at least 6 characters.');
    }
    if (newPassword !== confirmPassword) {
      return setError('New passwords do not match.');
    }

    setSubmitting(true);
    try {
      await changePassword({ email, currentPassword, newPassword });
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h3 style={{ margin: 0 }}>Change Password</h3>
          <button onClick={onClose} className="password-toggle-btn" aria-label="Close" style={{ position: 'static' }}>
            <FiX />
          </button>
        </div>

        {error && <div className="alert-error">{error}</div>}

        {done ? (
          <div className="fp-success-box">
            <FiCheckCircle className="fp-success-icon" />
            <p>Your password has been changed successfully.</p>
            <button onClick={onClose} className="portal-btn-student btn-animated fp-back-link">
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="portal-field">
              <label className="portal-label">Current Password</label>
              <input
                type={showPasswords ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="text-input input-animated"
              />
            </div>
            <div className="portal-field">
              <label className="portal-label">New Password</label>
              <input
                type={showPasswords ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="text-input input-animated"
              />
            </div>
            <div className="portal-field">
              <label className="portal-label">Confirm New Password</label>
              <input
                type={showPasswords ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="text-input input-animated"
              />
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted, #64748b)', cursor: 'pointer' }}>
              <input type="checkbox" checked={showPasswords} onChange={() => setShowPasswords(!showPasswords)} />
              Show passwords
            </label>

            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <button type="button" onClick={onClose} className="cancel-btn btn-animated" style={{ flex: 1 }}>
                Cancel
              </button>
              <button type="submit" className="publish-btn btn-animated" disabled={submitting} style={{ flex: 1 }}>
                {submitting ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChangePasswordModal;
