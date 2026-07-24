import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from './useTheme.js';
import { forgotPassword, resetPassword } from './apiClient.js';
import { FiSun, FiMoon, FiArrowLeft, FiMail, FiCheckCircle, FiEye, FiEyeOff } from 'react-icons/fi';

const RESEND_COOLDOWN_SECONDS = 30;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // step 1 = enter email, step 2 = enter code + new password, step 3 = done
  const [step, setStep] = useState(1);

  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const requestCode = async (e) => {
    e?.preventDefault();
    setError('');
    setInfo('');

    if (!email.trim()) {
      return setError('Please enter your email address.');
    }

    setSubmitting(true);
    try {
      const data = await forgotPassword({ email, role });
      setStep(2);
      setCooldown(RESEND_COOLDOWN_SECONDS);
      // Demo mode only (no email service configured on the backend): the
      // API hands the code back directly since it can't actually be
      // emailed anywhere. Once real email credentials are set, devCode is
      // never included and this line simply won't show.
      if (data.devCode) {
        setInfo(`Demo mode — no email service configured. Your code is: ${data.devCode}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');

    if (!code.trim() || code.trim().length !== 6) {
      return setError('Please enter the 6-digit code.');
    }
    if (newPassword.length < 6) {
      return setError('New password must be at least 6 characters.');
    }
    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    setSubmitting(true);
    try {
      await resetPassword({ email, role, code: code.trim(), newPassword });
      setStep(3);
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
            <p>{step === 1 ? "We'll email you a verification code" : step === 2 ? 'Enter the code we sent you' : 'All done'}</p>
          </div>

          {error && <div className="alert-error">{error}</div>}
          {info && step === 2 && <div className="alert-success">{info}</div>}

          {step === 1 && (
            <form onSubmit={requestCode} className="portal-form">
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
                {submitting ? 'Sending…' : 'Send Verification Code'}
              </button>

              <div className="portal-toggle-row">
                <Link to="/login" className="portal-link btn-animated">
                  Remembered your password? Sign In
                </Link>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleReset} className="portal-form">
              <p style={{ fontSize: '13px', color: 'var(--text-muted, #64748b)', margin: '-6px 0 4px' }}>
                Code sent to <strong>{email}</strong>
              </p>

              <div className="portal-field">
                <label className="portal-label">6-Digit Code</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  required
                  className="portal-input input-animated"
                  style={{ letterSpacing: '6px', fontSize: '20px', textAlign: 'center', fontWeight: 700 }}
                />
              </div>

              <div className="portal-field">
                <label className="portal-label">New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="portal-input input-animated"
                    style={{ paddingRight: '40px' }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle-btn" aria-label="Toggle password visibility">
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="portal-field">
                <label className="portal-label">Confirm New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="portal-input input-animated"
                />
              </div>

              <button type="submit" className="portal-btn-student btn-animated" disabled={submitting}>
                {submitting ? 'Resetting…' : 'Reset Password'}
              </button>

              <div className="portal-toggle-row">
                <span
                  onClick={cooldown > 0 || submitting ? undefined : requestCode}
                  className="portal-link btn-animated"
                  style={cooldown > 0 ? { opacity: 0.5, cursor: 'default' } : {}}
                >
                  {cooldown > 0 ? `Resend code in ${cooldown}s` : "Didn't get a code? Resend"}
                </span>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="fp-success-box">
              <FiCheckCircle className="fp-success-icon" />
              <p>Your password has been reset successfully.</p>
              <button onClick={() => navigate('/login')} className="portal-btn-student btn-animated fp-back-link">
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
