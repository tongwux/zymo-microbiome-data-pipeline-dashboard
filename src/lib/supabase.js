import { createClient } from '@supabase/supabase-js';
import { authConfig } from './auth-config';
import { readAuthCallback } from './auth-callback';

const url = process.env.REACT_APP_SUPABASE_URL || authConfig.url;
const key = process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY || authConfig.key;

export const authCallback = readAuthCallback(window.location.href);
let passwordRecovery = false;
export const isPasswordRecovery = () => passwordRecovery;
export const finishPasswordRecovery = () => { passwordRecovery = false; };

// Only a browser-safe publishable key belongs in the frontend bundle.
export const supabase = url && key ? createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storageKey: 'zymo-auth-session',
  },
}) : null;

// Subscribe immediately so a fast callback cannot fire before React mounts.
if (supabase) supabase.auth.onAuthStateChange((event) => {
  if (event === 'PASSWORD_RECOVERY') passwordRecovery = true;
  if (event === 'SIGNED_OUT') passwordRecovery = false;
});

export function requireAuthClient() {
  if (!supabase) throw new Error('Account service is not configured yet. Please try again later.');
  return supabase;
}

export function authRedirectUrl() {
  // PKCE uses the query string, leaving HashRouter's fragment for navigation.
  return new URL(`${process.env.PUBLIC_URL || ''}/`, window.location.origin).href;
}
