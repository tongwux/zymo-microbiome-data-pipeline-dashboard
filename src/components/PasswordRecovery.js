import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function PasswordRecovery() {
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [enteringCode, setEnteringCode] = useState(false);
  const [pending, setPending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!cooldown) return;
    const timer = setTimeout(() => setCooldown(value => Math.max(0, value - 1)), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  if (auth.loading) return <p role="status">Restoring your session...</p>;
  if (auth.recoveringPassword && auth.isAuthenticated) return <Navigate to="/reset-password" replace />;

  const requestCode = async () => {
    if (pending || cooldown) return;
    setPending(true); setError('');
    try {
      await auth.requestPasswordReset(email);
      setEnteringCode(true);
      setCooldown(60);
      setToken('');
      setNotice('If this email has an account, a verification code will arrive shortly. Enter the code here; do not click an old reset link.');
    } catch (failure) {
      setError(failure.code === 'over_email_send_rate_limit' || failure.status === 429
        ? 'Please wait before requesting another code. Use the latest email already sent.'
        : failure.message || 'Unable to send a code. Please try again.');
    } finally { setPending(false); }
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!enteringCode) { await requestCode(); return; }
    if (pending) return;
    setPending(true); setError('');
    try {
      await auth.verifyRecoveryCode(email, token);
      setToken('');
    } catch (failure) {
      setError(failure.code === 'otp_expired'
        ? 'That code has expired or is invalid. Use the newest email or request another code.'
        : failure.message || 'Unable to verify this code. Please try again.');
    } finally { setPending(false); }
  };

  return <div className="login-page"><div className="login-container auth-recovery-form">
    <div className="login-header"><h1>Reset your password</h1><p>{enteringCode ? 'Enter your email verification code.' : 'Receive a verification code by email.'}</p></div>
    {(error || auth.authError) && <p className="error-message" role="alert">{error || auth.authError}</p>}
    {notice && <p role="status">{notice}</p>}
    <form className="login-form" onSubmit={submit}>
      <div className="form-group"><label htmlFor="recovery-email">Email</label><input id="recovery-email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} /></div>
      {enteringCode && <div className="form-group"><label htmlFor="recovery-token">Verification code</label><input id="recovery-token" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6,10}" maxLength={10} required value={token} onChange={e => setToken(e.target.value.replace(/\s/g, ''))} /><small>Use the digits in the newest email. You can enter the code in this browser even if you read your email elsewhere.</small></div>}
      <button className="login-button" disabled={pending || !auth.isConfigured || (!enteringCode && cooldown > 0)}>{pending ? 'Please wait...' : enteringCode ? 'Verify code' : 'Send reset code'}</button>
      {enteringCode && <button type="button" disabled={pending || cooldown > 0 || !auth.isConfigured || !email.trim()} onClick={requestCode}>{cooldown ? `Request another code (${cooldown}s)` : 'Request another code'}</button>}
    </form>
    {!enteringCode && <p className="register-link"><button type="button" onClick={() => setEnteringCode(true)}>I already have a code</button></p>}
    <p className="register-link"><Link to="/login/individual">Back to sign in</Link></p>
  </div></div>;
}
