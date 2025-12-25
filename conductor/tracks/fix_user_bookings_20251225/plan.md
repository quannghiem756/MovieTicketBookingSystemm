# Track Plan: Fix User Bookings Retrieval Robustness

## Phase 1: Diagnosis & Reproduction [checkpoint: f2c2557]
- [x] Task: Create a reproduction test case in `backend/src/tests/BookingRepository.test.js` that simulates a booking with a deleted movie/showtime. [f2c2557]
- [x] Task: Conductor - User Manual Verification 'Diagnosis & Reproduction' (Protocol in workflow.md) [f2c2557]

## Phase 2: Implementation (Backend)
- [ ] Task: Refactor `MongoBookingRepository.js` to add null checks for all populated fields in `findByUserId` (and other find methods).
- [ ] Task: Ensure tests pass.
- [ ] Task: Conductor - User Manual Verification 'Implementation (Backend)' (Protocol in workflow.md)
