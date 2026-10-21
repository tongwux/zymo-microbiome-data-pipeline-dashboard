import { createClient } from '@supabase/supabase-js';
import { authConfig } from './auth-config';

const url = process.env.REACT_APP_SUPABASE_URL || authConfig.url;
const key = process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY || authConfig.key;

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

export function requireAuthClient() {
  if (!supabase) throw new Error('Account service is not configured yet. Please try again later.');
  return supabase;
}

export function authRedirectUrl() {
  // PKCE uses the query string, leaving HashRouter's fragment for navigation.
  return new URL(`${process.env.PUBLIC_URL || ''}/`, window.location.origin).href;
}
