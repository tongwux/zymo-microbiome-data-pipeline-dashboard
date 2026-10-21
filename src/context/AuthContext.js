import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, requireAuthClient, authRedirectUrl, authCallback, isPasswordRecovery, finishPasswordRecovery } from '../lib/supabase';

import { callbackErrorMessage, cleanAuthCallbackUrl } from '../lib/auth-callback';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [recoveringPassword, setRecoveringPassword] = useState(isPasswordRecovery);
  const [callbackError, setCallbackError] = useState('');

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    let active = true;
    let revision = 0;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => {
      revision += 1;
      if (!active) return;
      setSession(nextSession);
      setAuthError('');
      if (!authCallback.isCallback) setLoading(false);
      if (event === 'PASSWORD_RECOVERY') setRecoveringPassword(true);
      if (event === 'SIGNED_OUT') setRecoveringPassword(false);
    });
    if (isPasswordRecovery()) setRecoveringPassword(true);
    if (authCallback.isCallback) {
      // Inspect initialization errors explicitly; getSession alone can hide a
      // failed callback behind an otherwise valid or empty stored session.
      (async () => {
        try {
          const initialized = await supabase.auth.initialize();
          const { data, error } = await supabase.auth.getSession();
          if (!active) return;
          setSession(data?.session || null);
          const codeWasNotExchanged = authCallback.hasCode && new URL(window.location.href).searchParams.has('code');
          if (authCallback.hasError || initialized.error || error || codeWasNotExchanged || !data?.session) {
            setCallbackError(callbackErrorMessage(authCallback.errorCode));
          } else if (isPasswordRecovery()) {
            setRecoveringPassword(true);
          }
        } catch {
          if (active) setCallbackError(callbackErrorMessage(authCallback.errorCode));
        } finally {
          if (active) {
            window.history.replaceState(null, '', cleanAuthCallbackUrl(window.location.href));
            setLoading(false);
          }
        }
      })();
      return () => { active = false; subscription.unsubscribe(); };
    }
    const initialRevision = revision;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active || revision !== initialRevision) return;
      setSession(error ? null : data.session);
      setAuthError(error ? 'Unable to restore your session. Please sign in again.' : '');
      setLoading(false);
    }).catch(() => {
      if (!active || revision !== initialRevision) return;
      setSession(null);
      setAuthError('Unable to restore your session. Please sign in again.');
      setLoading(false);
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  const login = async (email, password) => {
    const { data, error } = await requireAuthClient().auth.signInWithPassword({ email: email.trim(), password });
    if (error) throw error;
    setSession(data.session);
    setAuthError('');
  };

  const register = async ({ email, password, userType }) => {
    const { data, error } = await requireAuthClient().auth.signUp({
      email: email.trim(), password,
      options: { emailRedirectTo: authRedirectUrl(), data: { user_type: userType } },
    });
    if (error) throw error;
    if (data.session) setSession(data.session);
    return data;
  };

  const logout = async () => {
    const { error } = await requireAuthClient().auth.signOut({ scope: 'local' });
    if (error) throw error;
    setSession(null);
    setRecoveringPassword(false);
  };

  const requestPasswordReset = async (email) => {
    const { error } = await requireAuthClient().auth.resetPasswordForEmail(email.trim(), { redirectTo: authRedirectUrl() });
    if (error) throw error;
  };

  const verifyRecoveryCode = async (email, token) => {
    const { data, error } = await requireAuthClient().auth.verifyOtp({
      email: email.trim(), token: token.trim(), type: 'recovery',
    });
    if (error) throw error;
    if (!data?.session) throw new Error('Unable to verify this code. Please request another code.');
    setSession(data.session);
    setRecoveringPassword(true);
  };

  const updatePassword = async (password) => {
    const { error } = await requireAuthClient().auth.updateUser({ password });
    if (error) throw error;
    setRecoveringPassword(false);
    finishPasswordRecovery();
  };

  const user = session?.user || null;
  return (
    <AuthContext.Provider value={{
      user, isAuthenticated: !!user, loading, authError, recoveringPassword, callbackError,
      // A user-selected portal preference, never an authorization role.
      userType: user?.user_metadata?.user_type || 'individual',
      isConfigured: !!supabase, login, register, logout, requestPasswordReset, verifyRecoveryCode, updatePassword,
      dismissCallbackError: () => setCallbackError(''),
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
