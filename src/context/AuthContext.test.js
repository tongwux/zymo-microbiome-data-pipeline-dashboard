import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { supabase, authCallback, isPasswordRecovery } from '../lib/supabase';

jest.mock('../lib/supabase', () => {
  const client = { auth: { initialize: jest.fn(), getSession: jest.fn(), onAuthStateChange: jest.fn(), signInWithPassword: jest.fn(), signUp: jest.fn(), signOut: jest.fn(), verifyOtp: jest.fn() } };
  return { authCallback: { isCallback: false }, isPasswordRecovery: jest.fn(() => false), finishPasswordRecovery: jest.fn(), supabase: client, requireAuthClient: () => client, authRedirectUrl: () => 'https://example.com/portal/' };
});
const session = { access_token: 'test-token', user: { id: 'user-a', email: 'a@example.com' } };
let notify;
let unsubscribe;
function Probe() {
  const auth = useAuth();
  const [error, setError] = React.useState('');
  return <><p role="status">{auth.loading ? 'loading' : auth.user?.email || 'signed out'}</p>
    <p>{error || auth.callbackError || auth.authError}</p><p>{auth.recoveringPassword ? 'recovery form' : 'normal session'}</p>
    <button onClick={() => auth.login(' a@example.com ', 'secret').catch(e => setError(e.message))}>login</button>
    <button onClick={() => auth.verifyRecoveryCode(' a@example.com ', '001234').catch(e => setError(e.message))}>verify code</button>
    <button onClick={() => auth.logout().catch(e => setError(e.message))}>logout</button>
    <button onClick={() => auth.register({ email: ' new@example.com ', password: 'long-password', userType: 'individual' }).catch(e => setError(e.message))}>register</button></>;
}
beforeEach(() => {
  jest.clearAllMocks();
  Object.assign(authCallback, { isCallback: false, hasError: false, hasCode: false, errorCode: null });
  isPasswordRecovery.mockReturnValue(false);
  supabase.auth.initialize.mockResolvedValue({ error: null });
  window.history.replaceState(null, '', '/');
  unsubscribe = jest.fn();
  supabase.auth.onAuthStateChange.mockImplementation(callback => { notify = callback; return { data: { subscription: { unsubscribe } } }; });
  supabase.auth.getSession.mockResolvedValue({ data: { session: null }, error: null });
  supabase.auth.signOut.mockResolvedValue({ error: null });
});
it('waits for stored session restoration and restores it after a remount', async () => {
  let resolve;
  supabase.auth.getSession.mockReturnValueOnce(new Promise(done => { resolve = done; }));
  const view = render(<AuthProvider><Probe /></AuthProvider>);
  expect(screen.getByRole('status')).toHaveTextContent('loading');
  await act(async () => resolve({ data: { session }, error: null }));
  expect(screen.getByRole('status')).toHaveTextContent('a@example.com');
  view.unmount();
  expect(unsubscribe).toHaveBeenCalled();
  supabase.auth.getSession.mockResolvedValue({ data: { session }, error: null });
  render(<AuthProvider><Probe /></AuthProvider>);
  await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('a@example.com'));
});
it('does not resurrect a stale session after a sign-out event', async () => {
  let resolve;
  supabase.auth.getSession.mockReturnValue(new Promise(done => { resolve = done; }));
  render(<AuthProvider><Probe /></AuthProvider>);
  act(() => notify('SIGNED_OUT', null));
  await act(async () => resolve({ data: { session }, error: null }));
  expect(screen.getByRole('status')).toHaveTextContent('signed out');
});
it('uses real password authentication and keeps failed attempts signed out', async () => {
  supabase.auth.signInWithPassword.mockResolvedValue({ error: new Error('Invalid credentials') });
  render(<AuthProvider><Probe /></AuthProvider>);
  await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('signed out'));
  fireEvent.click(screen.getByText('login'));
  await screen.findByText('Invalid credentials');
  expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({ email: 'a@example.com', password: 'secret' });
  expect(screen.getByRole('status')).toHaveTextContent('signed out');
});
it('does not treat an unconfirmed signup as an authenticated session', async () => {
  supabase.auth.signUp.mockResolvedValue({ data: { session: null, user: { id: 'new' } }, error: null });
  render(<AuthProvider><Probe /></AuthProvider>);
  await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('signed out'));
  fireEvent.click(screen.getByText('register'));
  await waitFor(() => expect(supabase.auth.signUp).toHaveBeenCalledWith({ email: 'new@example.com', password: 'long-password', options: { emailRedirectTo: 'https://example.com/portal/', data: { user_type: 'individual' } } }));
  expect(screen.getByRole('status')).toHaveTextContent('signed out');
});
it('clears the authenticated user on logout and later remount', async () => {
  supabase.auth.getSession.mockResolvedValueOnce({ data: { session }, error: null });
  const view = render(<AuthProvider><Probe /></AuthProvider>);
  await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('a@example.com'));
  fireEvent.click(screen.getByText('logout'));
  await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('signed out'));
  expect(supabase.auth.signOut).toHaveBeenCalledWith({ scope: 'local' });
  view.unmount();
  render(<AuthProvider><Probe /></AuthProvider>);
  await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('signed out'));
});
it('handles failed session restoration without leaving loading stuck', async () => {
  supabase.auth.getSession.mockRejectedValue(new Error('offline'));
  render(<AuthProvider><Probe /></AuthProvider>);
  await screen.findByText('Unable to restore your session. Please sign in again.');
  expect(screen.getByRole('status')).toHaveTextContent('signed out');
});

it('shows an expired callback even with an existing valid session', async () => {
  Object.assign(authCallback, { isCallback: true, hasError: true, errorCode: 'otp_expired' });
  window.history.replaceState(null, '', '/?error_code=otp_expired#error=access_denied');
  supabase.auth.getSession.mockResolvedValue({ data: { session }, error: null });
  render(<AuthProvider><Probe /></AuthProvider>);
  await screen.findByText(/This email link has expired/);
  expect(window.location.search).toBe('');
  expect(window.location.hash).toBe('#/');
  expect(supabase.auth.signOut).not.toHaveBeenCalled();
});
it('explains a code callback without a session instead of leaving a blank route', async () => {
  Object.assign(authCallback, { isCallback: true, hasCode: true });
  window.history.replaceState(null, '', '/?code=placeholder');
  render(<AuthProvider><Probe /></AuthProvider>);
  await screen.findByText(/Request a new link in the browser/);
  expect(screen.getByRole('status')).toHaveTextContent('signed out');
  expect(window.location.search).toBe('');
});
it('retains recovery intent if the SDK completed before React subscribed', async () => {
  Object.assign(authCallback, { isCallback: true, hasCode: true });
  isPasswordRecovery.mockReturnValue(true);
  supabase.auth.getSession.mockResolvedValue({ data: { session }, error: null });
  render(<AuthProvider><Probe /></AuthProvider>);
  await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('a@example.com'));
  expect(screen.getByText('recovery form')).toBeInTheDocument();
});

it('exchanges an emailed recovery code for a reset session', async () => {
  supabase.auth.verifyOtp.mockResolvedValue({ data: { session }, error: null });
  render(<AuthProvider><Probe /></AuthProvider>);
  await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('signed out'));
  fireEvent.click(screen.getByText('verify code'));
  await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('a@example.com'));
  expect(supabase.auth.verifyOtp).toHaveBeenCalledWith({ email: 'a@example.com', token: '001234', type: 'recovery' });
  expect(screen.getByText('recovery form')).toBeInTheDocument();
});
it('does not create a recovery session when OTP verification fails', async () => {
  supabase.auth.verifyOtp.mockResolvedValue({ error: new Error('Invalid recovery code') });
  render(<AuthProvider><Probe /></AuthProvider>);
  await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('signed out'));
  fireEvent.click(screen.getByText('verify code'));
  await screen.findByText('Invalid recovery code');
  expect(screen.getByRole('status')).toHaveTextContent('signed out');
  expect(screen.getByText('normal session')).toBeInTheDocument();
});
