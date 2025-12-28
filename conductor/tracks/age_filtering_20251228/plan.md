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
- [x] Task: Update Frontend Movie Types & Utils 91d5ee0
    - [ ] Sub-task: Update TypeScript interfaces (if applicable) or JSDoc for Movie objects to include the new ratings.
    - [ ] Sub-task: Create a frontend utility `getAgeFromDOB(dob)` matching the backend logic.
- [x] Task: Implement Rating Badges 60093ac
    - [ ] Sub-task: Create a `RatingBadge` component.
    - [ ] Sub-task: Integrate `RatingBadge` into `MovieCard.jsx`.
    - [ ] Sub-task: Integrate `RatingBadge` into `MovieDetails.jsx`.
- [x] Task: Implement Booking Restriction UI c8acd93
- [x] Task: Add Translations for Age Filtering f1329ac
- [x] Task: Update Admin Movie Form 3de2434
    - [ ] Sub-task: Update rating selection in MovieForm.jsx
- [x] Task: Conductor - User Manual Verification 'Frontend Visuals & Logic' (Protocol in workflow.md) [checkpoint: facb6bf]

## Phase 3: Integration & Testing
- [ ] Task: End-to-End Testing
    - [ ] Sub-task: Verify a C18 movie booking flow for an 18+ user (Success).
    - [ ] Sub-task: Verify a C18 movie booking flow for a 17yo user (Blocked).
    - [ ] Sub-task: Verify a K movie booking flow for a 10yo user (Warning + Success).
- [ ] Task: Conductor - User Manual Verification 'Integration & Testing' (Protocol in workflow.md)