# Specification - Authentication E2E Testing

## Overview
Develop a Cypress-based End-to-End (E2E) test suite to verify the core authentication flows of the Movie Ticket Booking System. This ensures that users can securely log in, their sessions are maintained via refresh tokens, and protected resources are correctly guarded.

## Functional Requirements
- **Login Verification:**
    - Simulate a user entering valid credentials (email/password) of an existing test user.
    - Verify successful authentication, redirection to the dashboard/home, and storage of session data.
- **Token Refresh Mechanism:**
    - Verify that the system correctly uses the refresh token to obtain a new access token without requiring a manual re-login.
    - Ensure the UI remains responsive and authenticated during this background process.
- **Protected Route Access:**
    - Verify that an authenticated user can access private pages (e.g., User Profile, Booking History).
    - Verify that an unauthenticated user (or one with an expired session) is redirected to the login page when attempting to access these same routes.

## Non-Functional Requirements
- **Reliability:** Tests should be stable and avoid "flakiness" by using appropriate Cypress wait strategies or interceptors.
- **Maintainability:** Use Cypress Page Object Models (POM) or custom commands if necessary to keep the test code clean.

## Acceptance Criteria
- [ ] A new Cypress test file `auth_flow.cy.js` is created in `frontend/cypress/e2e/`.
- [ ] The test suite successfully executes the login flow using an existing test user.
- [ ] The test suite verifies the automatic token refresh (can be simulated by clearing/expiring the access token manually in the test).
- [ ] The test suite verifies redirection logic for protected routes.
- [ ] All tests pass when running `npx cypress run` (in headless mode).

## Out of Scope
- Testing the Registration (Sign Up) flow.
- Testing Google OAuth integration (due to third-party redirection complexities).
- Testing Admin-specific authentication levels (focused on regular moviegoers for this track).
