# Track Plan: Fix User Bookings Retrieval Robustness

## Phase 1: Diagnosis & Reproduction
- [x] Task: Create a reproduction test case in `backend/src/tests/BookingRepository.test.js` that simulates a booking with a deleted movie/showtime.
- [~] Task: Conductor - User Manual Verification 'Diagnosis & Reproduction' (Protocol in workflow.md)

## Phase 2: Implementation (Backend)
- [ ] Task: Refactor `MongoBookingRepository.js` to add null checks for all populated fields in `findByUserId` (and other find methods).
- [ ] Task: Ensure tests pass.
- [ ] Task: Conductor - User Manual Verification 'Implementation (Backend)' (Protocol in workflow.md)
