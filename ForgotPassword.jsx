import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from './useTheme.js';
import { forgotPassword } from './apiClient.js';
import { FiSun, FiMoon, FiArrowLeft, FiMail, FiCheckCircle } from 'react-icons/fi';

const ForgotPassword = () => {
  const { theme, toggleTheme } = useTheme();

  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      return setError('Please enter your email address.');
    }

    setSubmitting(true);
    try {
      await forgotPassword({ email, role });
      setSent(true);
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
            <h2>Forgot Password</h2>
            <p>We'll email you a reset link</p>
          </div>

          {error && <div className="alert-error">{error}</div>}

          {sent ? (
            <div className="fp-success-box">
              <FiCheckCircle className="fp-success-icon" />
              <p>
                If an account exists for <strong>{email}</strong>, we've sent a password reset
                link to it. The link expires in 1 hour.
              </p>
              <Link to="/login" className="portal-btn-student btn-animated fp-back-link">
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="portal-form">
              <div className="portal-field">
                <label className="portal-label">I am a</label>
                <div className="fp-role-toggle">
                  <button
                    type="button"
                    className={`fp-role-btn ${role === 'student' ? 'fp-role-btn-active' : ''}`}
                    onClick={() => setRole('student')}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    className={`fp-role-btn ${role === 'admin' ? 'fp-role-btn-active' : ''}`}
                    onClick={() => setRole('admin')}
                  >
                    Admin
                  </button>
                </div>
              </div>

              <div className="portal-field">
                <label className="portal-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <FiMail className="fp-input-icon" />
                  <input
                    type="email"
                    placeholder="you@university.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="portal-input input-animated"
                    style={{ paddingLeft: '38px' }}
                  />
                </div>
              </div>

              <button type="submit" className="portal-btn-student btn-animated" disabled={submitting}>
                {submitting ? 'Sending…' : 'Send Reset Link'}
              </button>

              <div className="portal-toggle-row">
                <Link to="/login" className="portal-link btn-animated">
                  Remembered your password? Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
