# Implementation Plan: E2E Demo Recording Tests

## Phase 1: Environment Setup & Data Seeding
- [x] Task: Create Demo Seeding Script
    - [x] Create `backend/src/infrastructure/database/seeds/demo_seed.js` (or similar location) to populate the database with consistent data (users, movies, theaters, showtimes).
    - [x] Ensure the script can be run independently and clears existing relevant data.
- [x] Task: Configure Cypress for Demo Flows
    - [x] Create the directory `frontend/cypress/e2e/demo-flows/`.
    - [x] Add a `cypress.config.js` override or environment variable support for "demo mode" (e.g., setting `slowTestThreshold` or custom `baseUrl`).
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Environment Setup & Data Seeding' (Protocol in workflow.md)

## Phase 2: Booking Journey Demo Test
- [ ] Task: Implement Full Booking Flow Test
    - [ ] Create `frontend/cypress/e2e/demo-flows/booking_journey.cy.js`.
    - [ ] **Red Phase**: Write test for User Registration -> Login -> Movie Selection -> Seat Selection -> Mock Payment.
    - [ ] **Green Phase**: Implement the test logic with intentional `cy.wait()` calls or a global `slowdown` command to ensure smooth visual flow.
    - [ ] Verify visual highlighting of key interaction points.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Booking Journey Demo Test' (Protocol in workflow.md)

## Phase 3: Admin Operations Demo Test
- [ ] Task: Implement Admin Workflow Test
    - [ ] Create `frontend/cypress/e2e/demo-flows/admin_ops.cy.js`.
    - [ ] **Red Phase**: Write test for Admin Login -> Add Movie -> Create Showtime -> View Reports.
    - [ ] **Green Phase**: Implement logic with deliberate pacing.
    - [ ] Ensure "New Movie" created in the test is easily visible in the resulting list.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Admin Operations Demo Test' (Protocol in workflow.md)

## Phase 4: Integration & Cleanup
- [ ] Task: Add NPM Scripts for Recording
    - [ ] Add `"test:demo": "cypress run --spec 'cypress/e2e/demo-flows/**/*'"` to `frontend/package.json`.
    - [ ] Ensure any necessary environment variables (e.g., `CYPRESS_SLOWMOTION=500`) are included or documented.
- [ ] Task: Final Quality Gate Check
    - [ ] Verify all tests pass in a single run.
    - [ ] Confirm database reset works as expected after multiple runs.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Integration & Cleanup' (Protocol in workflow.md)
