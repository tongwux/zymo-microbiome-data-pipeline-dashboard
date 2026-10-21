import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuthBoundary from './AuthBoundary';
import { useAuth } from '../context/AuthContext';
jest.mock('../context/AuthContext', () => ({ useAuth: jest.fn() }));
it('waits before mounting hash routes during initialization', () => {
  useAuth.mockReturnValue({ loading: true, callbackError: '' });
  render(<AuthBoundary><p>application routes</p></AuthBoundary>);
  expect(screen.getByRole('status')).toBeInTheDocument();
  expect(screen.queryByText('application routes')).not.toBeInTheDocument();
});
it('offers a fresh reset link when a callback fails', () => {
  const dismiss = jest.fn();
  useAuth.mockReturnValue({ loading: false, callbackError: 'Email link has expired.', dismissCallbackError: dismiss });
  render(<AuthBoundary><p>application routes</p></AuthBoundary>);
  expect(screen.getByRole('alert')).toHaveTextContent('expired');
  const retry = screen.getByRole('link', { name: 'Request a new reset link' });
  expect(retry).toHaveAttribute('href', '/#/forgot-password');
  fireEvent.click(retry);
  expect(dismiss).toHaveBeenCalledTimes(1);
  expect(screen.queryByText('application routes')).not.toBeInTheDocument();
});
