import { readAuthCallback, cleanAuthCallbackUrl, callbackErrorMessage } from './auth-callback';

it('recognizes expired errors in both query and fragment', () => {
  const result = readAuthCallback('https://example.com/portal/?error_code=otp_expired#error=access_denied');
  expect(result).toMatchObject({ isCallback: true, hasError: true, errorCode: 'otp_expired' });
  expect(callbackErrorMessage(result.errorCode)).toMatch(/expired or has already been used/);
});
it('does not misinterpret ordinary hash routes as callbacks', () => {
  expect(readAuthCallback('https://example.com/portal/#/forgot-password?error=help').isCallback).toBe(false);
});
it('removes auth credentials and error fragments while preserving ordinary query parameters', () => {
  expect(cleanAuthCallbackUrl('https://example.com/portal/?code=secret&utm_source=email#access_token=secret&refresh_token=secret')).toBe('/portal/?utm_source=email#/');
  expect(cleanAuthCallbackUrl('https://example.com/portal/?error_code=otp_expired#/reset-password')).toBe('/portal/#/reset-password');
});
it('never displays provider-controlled error descriptions', () => {
  const result = readAuthCallback('https://example.com/?error_description=untrusted&error=oops');
  expect(callbackErrorMessage(result.errorCode)).not.toContain('untrusted');
});
