import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function AuthBoundary({ children }) {
  const { loading, callbackError, dismissCallbackError } = useAuth();
  if (loading) return <p role="status">Restoring your session...</p>;
  if (!callbackError) return children;
  const base = process.env.PUBLIC_URL || '';
  return <div className="login-page"><div className="login-container auth-callback-error">
    <div className="login-header"><h1>Email link unavailable</h1></div>
    <p role="alert">{callbackError}</p>
    <p>Use the same browser and browser profile to request and open the link. Reopening an old link will not restore it.</p>
    <p><a onClick={dismissCallbackError} className="portal-button" href={`${base}/#/forgot-password`}>Request a new reset link</a></p>
    <p><a onClick={dismissCallbackError} href={`${base}/#/login/individual`}>Back to sign in</a></p>
  </div></div>;
}
