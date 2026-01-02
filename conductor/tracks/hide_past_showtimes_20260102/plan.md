# Plan: Hide Past Showtimes for Customers

## Phase 1: Backend Logic & API Refinement
The goal of this phase is to update the backend services to handle the filtering of showtimes based on the time-based rules defined in the spec.

- [x] Task: Update `ShowtimeService` to include logic for determining showtime status (Active, Closed, Past). 144f9ab
- [x] Task: Update `ShowtimeRepository` or equivalent query logic to filter out past showtimes for public (non-admin) requests. f58fddf
- [x] Task: Ensure Admin-specific routes or query flags bypass the time-based filtering. f58fddf
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Backend Logic & API Refinement' (Protocol in workflow.md)

## Phase 2: Frontend UI Updates
This phase focuses on updating the customer-facing components to handle the "Booking Closed" state and ensuring past showtimes are not rendered.

- [ ] Task: Update showtime listing components to check for the 15-minute "Booking Closed" window.
- [ ] Task: Replace the "Book" button with "Booking Closed" text when the threshold is met.
- [ ] Task: Verify that search results and widgets correctly hide showtimes that have already started.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Frontend UI Updates' (Protocol in workflow.md)

## Phase 3: Admin Dashboard Verification
Verify that the admin experience remains unchanged and all showtimes are still visible and manageable.

- [ ] Task: Verify Admin Dashboard showtime management still displays past showtimes.
- [ ] Task: Verify Admin Dashboard analytics/booking history still displays past showtimes.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Admin Dashboard Verification' (Protocol in workflow.md)
