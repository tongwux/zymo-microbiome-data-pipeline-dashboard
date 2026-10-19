# ZYMO Microbiome Portal

A React frontend prototype exploring the customer journey from sequencing-service selection and enterprise onboarding to orders, project tracking, and reports.

**Current status:** workflow prototype with demonstration data. This repository does not yet implement a microbiome processing pipeline or production authentication.

## Implemented

- Routes and screens for individual/enterprise login, onboarding, services, cart, orders, projects, reports, and account settings.
- Shared sidebar and notification components, with authentication and cart contexts.
- Project status tables and progress indicators using sample records.
- Component-specific CSS and responsive layout rules.
- Create React App build scripts and GitHub Pages deployment configuration.

## Mock behavior and boundaries

| Area | Current behavior |
| --- | --- |
| Login | Checks hardcoded demo credentials in the browser. Context holds an in-memory authentication flag; this is UI gating, not backend authorization. |
| Project tracking | Displays local sample records rather than live sequencing jobs. |
| Enterprise verification | Presents onboarding forms; no backend verification service is included. |
| Payments | The project payment handler is a logging placeholder. No payment integration is included. |
| Reports and pipeline | Screens illustrate the intended flow; sequencing execution, data ingestion, and server-side report generation are not implemented. |

Use dummy information only. The configured hosting address is `https://zymomicrobiome.site`; its availability was not verified during this documentation update.

## Technical approach

React Router expresses the multi-step journey, while Context shares session and cart state. Keeping the prototype client-side makes the UI flows easy to explore independently of a future backend.

- [App.js](src/App.js): route composition.
- [AuthContext.js](src/context/AuthContext.js): demo session state.
- [CartContext.js](src/context/CartContext.js): cart state.
- [Project.js](src/components/Project.js): example records and status presentation.
- `src/components/`: feature screens and corresponding styles.

## Run locally

Use Node.js and npm compatible with the pinned dependencies; a verified runtime version has not yet been documented.

```sh
git clone https://github.com/tongwux/zymo-microbiome-data-pipeline-dashboard.git
cd zymo-microbiome-data-pipeline-dashboard
npm ci
npm start
```

Open `http://localhost:3000`. Demo credentials are defined in `IndividualLogin.js` and `EnterpriseLogin.js`; these are not real accounts.

```sh
npm run build
npm test
```

These are available commands, not recorded passing results. The test runner is configured, but no business test suite or CI workflow is currently committed. Builds and live hosting were not exercised during this documentation review.

## Planned — not implemented

- Backend-enforced authentication and authorization.
- Persisted project/order APIs, with loading, empty, retry, and failure states.
- Tests for onboarding and cart behavior, followed by CI.
- An explicit integration contract between the portal and any future sequencing pipeline.

## Project scope

The current contribution visible in this repository is frontend workflow composition and business-interface prototyping. It does not establish production usage or data-pipeline performance, and no company endorsement is implied. This README grants no new software or asset license; consult repository license files and third-party terms before reuse.
