# Implementation Plan - Age Filtering

## Phase 1: Backend Implementation & Data Standardization
- [x] Task: Update `Movie` Model with Vietnamese Ratings 471f472
    - [ ] Sub-task: Modify `backend/src/domain/Movie.js` and `backend/src/infrastructure/MovieModel.js` to enforce the new enum values: `['P', 'K', 'C13', 'C16', 'C18']`.
    - [ ] Sub-task: Create a migration script or update `seedMovies.js` to update existing movie records with valid Vietnamese ratings.
- [x] Task: Implement Age Verification Logic in `UserService` 01ea06a
    - [ ] Sub-task: Add a helper method `calculateAge(dateOfBirth)` in `User` domain or a utility file.
    - [ ] Sub-task: Add `canBookMovie(userAge, movieRating)` logic to determine eligibility.
- [x] Task: Secure Booking API Endpoint d8b11a5
    - [ ] Sub-task: Update `BookingService.js` (or relevant controller) to fetch the user's DOB and the movie's rating.
    - [ ] Sub-task: Throw a `403 Forbidden` error if the age requirement is not met.
- [x] Task: Conductor - User Manual Verification 'Backend Implementation & Data Standardization' (Protocol in workflow.md) [checkpoint: 3e62f3a]

## Phase 2: Frontend Visuals & Logic
- [ ] Task: Update Frontend Movie Types & Utils
    - [ ] Sub-task: Update TypeScript interfaces (if applicable) or JSDoc for Movie objects to include the new ratings.
    - [ ] Sub-task: Create a frontend utility `getAgeFromDOB(dob)` matching the backend logic.
- [ ] Task: Implement Rating Badges
    - [ ] Sub-task: Create a `RatingBadge` component.
    - [ ] Sub-task: Integrate `RatingBadge` into `MovieCard.jsx`.
    - [ ] Sub-task: Integrate `RatingBadge` into `MovieDetails.jsx`.
- [ ] Task: Implement Booking Restriction UI
    - [ ] Sub-task: Modify `MovieDetails.jsx` to disable the "Book Ticket" button for underage users.
    - [ ] Sub-task: Add the "K" rating confirmation modal/checkbox logic.
- [ ] Task: Conductor - User Manual Verification 'Frontend Visuals & Logic' (Protocol in workflow.md)

## Phase 3: Integration & Testing
- [ ] Task: End-to-End Testing
    - [ ] Sub-task: Verify a C18 movie booking flow for an 18+ user (Success).
    - [ ] Sub-task: Verify a C18 movie booking flow for a 17yo user (Blocked).
    - [ ] Sub-task: Verify a K movie booking flow for a 10yo user (Warning + Success).
- [ ] Task: Conductor - User Manual Verification 'Integration & Testing' (Protocol in workflow.md)