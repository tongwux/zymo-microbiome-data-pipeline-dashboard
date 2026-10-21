import React from 'react';
import { render, screen } from '@testing-library/react';
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
  useAuth.mockReturnValue({ loading: false, callbackError: 'Email link has expired.' });
  render(<AuthBoundary><p>application routes</p></AuthBoundary>);
  expect(screen.getByRole('alert')).toHaveTextContent('expired');
  expect(screen.getByRole('link', { name: 'Request a new reset link' })).toHaveAttribute('href', '/#/forgot-password');
  expect(screen.queryByText('application routes')).not.toBeInTheDocument();
});
