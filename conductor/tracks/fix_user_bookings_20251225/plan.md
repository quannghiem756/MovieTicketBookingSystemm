# Track Plan: Fix User Bookings Retrieval Robustness

## Phase 1: Diagnosis & Reproduction [checkpoint: f2c2557]
- [x] Task: Create a reproduction test case in `backend/src/tests/BookingRepository.test.js` that simulates a booking with a deleted movie/showtime. [f2c2557]
- [x] Task: Conductor - User Manual Verification 'Diagnosis & Reproduction' (Protocol in workflow.md) [f2c2557]

## Phase 2: Implementation (Backend)
- [x] Task: Refactor `MongoBookingRepository.js` to add null checks for all populated fields in `findByUserId` (and other find methods). [3a79f62]
- [x] Task: Ensure tests pass. [3a79f62]
- [~] Task: Conductor - User Manual Verification 'Implementation (Backend)' (Protocol in workflow.md)
