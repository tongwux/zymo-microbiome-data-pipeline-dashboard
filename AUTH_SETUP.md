# Authentication integration status

Connected project: qpccmhrdzjhnyaqjfzab. Browser integration prepared; publishing and live signup verification await Auth URL configuration.

## Backend setup

- Use Supabase Auth email/password accounts. Passwords belong in Supabase Auth, never in a public profiles table or frontend code.
- Configure the Site URL and allowed redirect URL as `https://tongwux.github.io/zymo-microbiome-data-pipeline-dashboard/` (include trailing slash).
- Keep email confirmation enabled. Configure a minimum password length of at least 12 characters and appropriate rate limits. Configure a production email sender before opening registration broadly.
- PKCE confirmation and password-recovery links must be opened in the same browser that requested them.
- Provide only the project URL and browser-safe publishable key in the frontend build. Never use a secret/service-role key in REACT_APP variables.

## Local/build configuration

Use Node 24 (see .nvmrc). The selected project URL and browser-safe publishable key are in src/lib/auth-config.js. Optional local overrides can be set using .env.example as .env.local. These environment variables are embedded into the static build; they are public project configuration, not backend secrets.

```sh
npm ci
npm test -- --watchAll=false --runInBand --cacheDirectory=./node_modules/.cache/jest
npm run build
```

Existing account, order, and report screens still use demonstration records. Portal metadata is a display preference, not a company entitlement. Any future per-user database tables require backend authorization with row-level policies based on auth.uid(); UI route guards are not database access control.

## Before publishing

Verify real registration, confirmation email callback, invalid-password handling, successful sign-in, page refresh, token refresh, logout, password recovery, and inaccessible protected pages when signed out. Unit tests mock the SDK and do not prove live service configuration.

Validation: 14 unit/component tests passed; the real Auth API rejected invalid credentials; security advisors reported no findings. These checks do not prove live signup, email delivery, or confirmation callbacks.

No custom SMTP is configured by this change. Supabase default mail delivery only supports organization team email addresses, so use the organization owner email for the first test. Public signup requires a configured SMTP sender.
