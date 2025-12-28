# Track Specification: Fix User Bookings Retrieval Robustness

## 1. Goal
Fix the API for retrieving user bookings (`GET /api/bookings/user/:userId`) to be robust against missing referenced data (e.g., deleted movies or showtimes). Currently, it is "unusable", likely due to null pointer exceptions when accessing populated fields.

## 2. Context
The `MongoBookingRepository` performs deep population of `showtimeId`, `movieId`, and `theaterId`. It then manually maps these fields to a response object. If any of these relationships are broken (e.g., `doc.showtimeId.movieId` is null), the mapping code throws an error, causing the API to return a 500 status.

## 3. Core Requirements
- **Robust Mapping:** The repository should safely handle missing references (null checks).
- **Graceful Degradation:** If a movie or showtime is missing, the booking should still be returned, possibly with placeholder information or marked as "unavailable".
- **Testing:** Verify the fix with unit tests that simulate bookings with missing references.

## 4. Key Files
- `backend/src/infrastructure/repositories/MongoBookingRepository.js`: The file containing the fragile mapping logic.

## 5. Non-Functional Requirements
- **Performance:** Ensure that the added checks do not significantly impact the performance of the query.
