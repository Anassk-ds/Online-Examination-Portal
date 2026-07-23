import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTheme } from './useTheme.js';
import { resetPassword } from './apiClient.js';
import { FiSun, FiMoon, FiArrowLeft, FiLock, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi';

const ResetPassword = () => {
  const { theme, toggleTheme } = useTheme();
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password.trim() || password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }
    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    setSubmitting(true);
    try {
      await resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="portal-window page-fade-in">
      <Link
        to="/login"
        className="theme-toggle-btn btn-animated"
        style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10, display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
      >
        <FiArrowLeft /> Login
      </Link>

      <button
        onClick={toggleTheme}
        className="theme-toggle-btn btn-animated"
        style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10 }}
      >
        {theme === 'light' ? <FiMoon /> : <FiSun />}
      </button>

      <div className="portal-panel portal-panel-active">
        <div className="portal-card card-animated">
          <div className="portal-header">
            <h2>Reset Password</h2>
            <p>Choose a new password</p>
          </div>

          {error && <div className="alert-error">{error}</div>}

          {success ? (
            <div className="fp-success-box">
              <FiCheckCircle className="fp-success-icon" />
              <p>Your password has been reset. Redirecting you to Login…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="portal-form">
              <div className="portal-field">
                <label className="portal-label">New Password</label>
                <div style={{ position: 'relative' }}>
                  <FiLock className="fp-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="portal-input input-animated"
                    style={{ paddingLeft: '38px', paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle-btn"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="portal-field">
                <label className="portal-label">Confirm New Password</label>
                <div style={{ position: 'relative' }}>
                  <FiLock className="fp-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="portal-input input-animated"
                    style={{ paddingLeft: '38px' }}
                  />
                </div>
              </div>

              <button type="submit" className="portal-btn-student btn-animated" disabled={submitting}>
                {submitting ? 'Resetting…' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
