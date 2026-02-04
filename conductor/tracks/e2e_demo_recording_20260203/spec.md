# Specification: E2E Demo Recording Tests

## Overview
This track involves creating a specialized suite of End-to-End (E2E) tests designed specifically for recording a demonstration of the project's key features. These tests will emphasize readability and visual flow, ensuring that observers can easily follow the system's core capabilities.

## Functional Requirements
- **Demo Flow 1: Full Booking Journey**
  - Automate: User Registration -> Login -> Search for a Movie -> Select Showtime & Seats -> Mock Payment -> Ticket Confirmation.
- **Demo Flow 2: Admin Operations**
  - Automate: Admin Login -> Add a New Movie -> Create/Manage Showtimes -> View System Reports/Dashboard.
- **Environment Preparation**
  - Implementation of a "Clean State" setup that seeds specific demo data or resets the database before execution to ensure consistency.

## Non-Functional Requirements
- **Human-like Pacing:** Tests must include intentional delays (slow-motion) between interactions so the recording is informative rather than instantaneous.
- **Organization:** Demo-specific tests will be isolated in a dedicated directory: `frontend/cypress/e2e/demo-flows/`.
- **Reliability:** Tests must be robust against timing issues, utilizing explicit waits or assertions appropriate for a recording environment.

## Acceptance Criteria
- [ ] Two distinct test files exist in `frontend/cypress/e2e/demo-flows/`.
- [ ] Running the demo tests shows a logical, human-paced progression through the UI.
- [ ] Database seeding script for the demo environment is functional and integrated into the test flow.
- [ ] The "Full Booking Journey" completes with a visible ticket/confirmation.
- [ ] The "Admin Operations" successfully updates the system state (e.g., new movie appears in listings).

## Out of Scope
- Integration of actual screen-recording software (this track focuses on the *tests* that will be recorded).
- Performance testing or edge-case error handling beyond what is needed for a "happy path" demo.
