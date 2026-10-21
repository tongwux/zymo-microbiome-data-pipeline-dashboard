import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function AccountAuth({ mode = 'login', portal = 'individual' }) {
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [userType, setUserType] = useState(portal);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const registering = mode === 'register';
  const resetting = mode === 'reset';
  const forgot = mode === 'forgot';
  const title = registering ? 'Create your account' : resetting ? 'Set a new password' : forgot ? 'Reset your password' : `${portal === 'enterprise' ? 'Enterprise' : 'Individual'} Login`;

  if (auth.loading) return <p role="status">Restoring your session...</p>;
  if (auth.isAuthenticated && !resetting && !auth.recoveringPassword) return <Navigate to="/dashboard" replace />;
  if (resetting && !auth.isAuthenticated) return <Navigate to="/forgot-password" replace />;

  const submit = async (event) => {
    event.preventDefault();
    if (pending) return;
    setError(''); setMessage('');
    if ((registering || resetting) && password !== confirmation) { setError('Passwords do not match.'); return; }
    setPending(true);
    try {
      if (registering) {
        const data = await auth.register({ email, password, userType });
        if (!data.session) setMessage('Check your email to confirm your account. Open the confirmation link in this same browser, then sign in.');
      } else if (forgot) {
        await auth.requestPasswordReset(email);
        setMessage('If an account exists for this email, a reset link will be sent. Open it in this same browser.');
      } else if (resetting) {
        await auth.updatePassword(password);
        setMessage('Password updated.');
      } else {
        await auth.login(email, password);
      }
      setPassword(''); setConfirmation('');
    } catch (failure) {
      setError(failure.code === 'invalid_credentials' ? 'Invalid email or password.' : failure.message || 'Unable to complete your request. Please try again.');
    } finally { setPending(false); }
  };

  return <div className="login-page"><div className="login-container">
    <div className="login-header"><h1>{title}</h1><p>{registering ? 'Use your email to create a ZYMO account.' : 'Welcome to your ZYMO portal.'}</p></div>
    {!auth.isConfigured && <p role="alert">Account service is not configured yet. Please try again later.</p>}
    {(error || auth.authError) && <p className="error-message" role="alert">{error || auth.authError}</p>}
    {message && <p role="status">{message}</p>}
    <form className="login-form" onSubmit={submit}>
      {!resetting && <div className="form-group"><label htmlFor="auth-email">Email</label><input id="auth-email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} /></div>}
      {!forgot && <div className="form-group"><label htmlFor="auth-password">{resetting ? 'New password' : 'Password'}</label><input id="auth-password" type="password" autoComplete={registering || resetting ? 'new-password' : 'current-password'} minLength={registering || resetting ? 12 : undefined} required value={password} onChange={e => setPassword(e.target.value)} />{(registering || resetting) && <small>Use at least 12 characters.</small>}</div>}
      {(registering || resetting) && <div className="form-group"><label htmlFor="auth-confirmation">Confirm password</label><input id="auth-confirmation" type="password" autoComplete="new-password" required value={confirmation} onChange={e => setConfirmation(e.target.value)} /></div>}
      {registering && <div className="form-group"><label htmlFor="auth-portal">Portal</label><select id="auth-portal" value={userType} onChange={e => setUserType(e.target.value)}><option value="individual">Individual</option><option value="enterprise">Enterprise</option></select><small>Portal selection does not verify company membership.</small></div>}
      <button className="login-button" type="submit" disabled={pending || !auth.isConfigured}>{pending ? 'Please wait...' : registering ? 'Create account' : forgot ? 'Send reset link' : resetting ? 'Update password' : 'Sign In'}</button>
    </form>
    <div className="register-link">
      {!registering && !resetting && <p><Link to="/register">Create an account</Link></p>}
      {!forgot && !resetting && <p><Link to="/forgot-password">Forgot password?</Link></p>}
      <p><Link to="/login">Back to login portals</Link></p>
      {resetting && !auth.recoveringPassword && message && <Link to="/dashboard">Continue to dashboard</Link>}
    </div>
  </div></div>;
}
