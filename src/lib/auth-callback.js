const CALLBACK_PARAMETERS = ['code', 'error', 'error_code', 'error_description', 'access_token', 'refresh_token', 'expires_in', 'expires_at', 'token_type', 'type', 'provider_token', 'provider_refresh_token', 'sb'];

export function readAuthCallback(href) {
  const url = new URL(href);
  const fragment = url.hash.startsWith('#/') ? new URLSearchParams() : new URLSearchParams(url.hash.slice(1));
  const errorCode = url.searchParams.get('error_code') || fragment.get('error_code');
  const hasError = !!(errorCode || url.searchParams.get('error') || fragment.get('error'));
  const hasCode = url.searchParams.has('code');
  const hasTokens = fragment.has('access_token') || fragment.has('refresh_token');
  return { isCallback: hasError || hasCode || hasTokens, hasError, hasCode, errorCode };
}

export function callbackErrorMessage(code) {
  if (code === 'otp_expired' || code === 'access_denied') return 'This email link has expired or has already been used.';
  return 'This email link could not complete sign-in. Request a new link in the browser where you will open the email, then try again there.';
}

export function cleanAuthCallbackUrl(href) {
  const url = new URL(href);
  CALLBACK_PARAMETERS.forEach(key => url.searchParams.delete(key));
  if (!url.hash.startsWith('#/')) url.hash = '/';
  return url.pathname + url.search + url.hash;
}
