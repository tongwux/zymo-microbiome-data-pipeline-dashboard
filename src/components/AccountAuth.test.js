import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import '@testing-library/jest-dom';
import AccountAuth from './AccountAuth';
import { useAuth } from '../context/AuthContext';

jest.mock('../context/AuthContext', () => ({ useAuth: jest.fn() }));
let auth;
beforeEach(() => {
  auth = { loading: false, isAuthenticated: false, isConfigured: true, register: jest.fn(), login: jest.fn(), authError: '', requestPasswordReset: jest.fn() };
  useAuth.mockReturnValue(auth);
});
function mount(mode = 'login') {
  return render(<MemoryRouter><Routes><Route path="/" element={<AccountAuth mode={mode} />} /><Route path="/dashboard" element={<p>Dashboard destination</p>} /></Routes></MemoryRouter>);
}
it('blocks account submissions if the backend is missing', () => {
  auth.isConfigured = false;
  mount();
  expect(screen.getByRole('alert')).toHaveTextContent('not configured');
  expect(screen.getByRole('button', { name: 'Sign In' })).toBeDisabled();
});
it('checks password confirmation before registration', () => {
  mount('register');
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'new@example.com' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'long-password-123' } });
  fireEvent.change(screen.getByLabelText('Confirm password'), { target: { value: 'different-password' } });
  fireEvent.click(screen.getByRole('button', { name: 'Create account' }));
  expect(screen.getByRole('alert')).toHaveTextContent('Passwords do not match');
  expect(auth.register).not.toHaveBeenCalled();
});
it('shows email confirmation instructions instead of claiming immediate login', async () => {
  auth.register.mockResolvedValue({ session: null });
  mount('register');
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'new@example.com' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'long-password-123' } });
  fireEvent.change(screen.getByLabelText('Confirm password'), { target: { value: 'long-password-123' } });
  fireEvent.click(screen.getByRole('button', { name: 'Create account' }));
  await screen.findByRole('status');
  expect(screen.getByRole('status')).toHaveTextContent('Check your email');
  expect(auth.register).toHaveBeenCalledWith({ email: 'new@example.com', password: 'long-password-123', userType: 'individual' });
  expect(screen.queryByText('Dashboard destination')).not.toBeInTheDocument();
});
it('shows backend login failures and allows retry', async () => {
  auth.login.mockRejectedValue({ code: 'invalid_credentials', message: 'details' });
  mount();
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'new@example.com' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'incorrect' } });
  fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
  await screen.findByRole('alert');
  expect(screen.getByRole('alert')).toHaveTextContent('Invalid email or password.');
  await waitFor(() => expect(screen.getByRole('button', { name: 'Sign In' })).toBeEnabled());
});
it('redirects restored sessions away from the login form', () => {
  auth.isAuthenticated = true;
  mount();
  expect(screen.getByText('Dashboard destination')).toBeInTheDocument();
});
