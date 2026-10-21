import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import '@testing-library/jest-dom';
import PasswordRecovery from './PasswordRecovery';
import { useAuth } from '../context/AuthContext';
jest.mock('../context/AuthContext', () => ({ useAuth: jest.fn() }));
let auth;
beforeEach(() => {
  auth = { loading: false, isConfigured: true, isAuthenticated: false, recoveringPassword: false, requestPasswordReset: jest.fn().mockResolvedValue(), verifyRecoveryCode: jest.fn().mockResolvedValue() };
  useAuth.mockReturnValue(auth);
});
function mount() {
  return render(<MemoryRouter><Routes><Route path="/" element={<PasswordRecovery />} /><Route path="/reset-password" element={<p>New password form</p>} /></Routes></MemoryRouter>);
}
it('sends a code and prevents immediate repeated requests', async () => {
  mount();
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@example.com' } });
  fireEvent.click(screen.getByRole('button', { name: 'Send reset code' }));
  await screen.findByLabelText('Verification code');
  expect(auth.requestPasswordReset).toHaveBeenCalledWith('a@example.com');
  const resend = screen.getByRole('button', { name: /Request another code/ });
  expect(resend).toBeDisabled();
  fireEvent.click(resend);
  expect(auth.requestPasswordReset).toHaveBeenCalledTimes(1);
});
it('allows a code from another browser without sending another email', async () => {
  mount();
  fireEvent.click(screen.getByRole('button', { name: 'I already have a code' }));
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@example.com' } });
  fireEvent.change(screen.getByLabelText('Verification code'), { target: { value: '001234' } });
  fireEvent.click(screen.getByRole('button', { name: 'Verify code' }));
  await waitFor(() => expect(auth.verifyRecoveryCode).toHaveBeenCalledWith('a@example.com', '001234'));
  expect(auth.requestPasswordReset).not.toHaveBeenCalled();
});
it('keeps invalid codes on the verification screen with a useful error', async () => {
  auth.verifyRecoveryCode.mockRejectedValue({ code: 'otp_expired' });
  mount();
  fireEvent.click(screen.getByRole('button', { name: 'I already have a code' }));
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@example.com' } });
  fireEvent.change(screen.getByLabelText('Verification code'), { target: { value: '001234' } });
  fireEvent.click(screen.getByRole('button', { name: 'Verify code' }));
  await screen.findByRole('alert');
  expect(screen.getByRole('alert')).toHaveTextContent('expired or is invalid');
  expect(screen.queryByText('New password form')).not.toBeInTheDocument();
});
it('opens the new password form only with a verified recovery session', () => {
  auth.isAuthenticated = true;
  auth.recoveringPassword = true;
  mount();
  expect(screen.getByText('New password form')).toBeInTheDocument();
});
