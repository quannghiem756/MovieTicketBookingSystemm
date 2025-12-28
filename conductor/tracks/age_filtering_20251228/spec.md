# Track Specification: Age-Based Movie Filtering and Booking Restrictions

## Overview
This track implements an age verification and restriction system for the Movie Ticket Booking System. It ensures that registered users can only book movies appropriate for their age based on their Date of Birth and the Vietnamese Cinema Standard rating system.

## Functional Requirements

### 1. Movie Rating Standardization
- Implement the Vietnamese Cinema Standard for all movies:
    - **P**: All ages.
    - **K**: Under 13 requires guardian (Soft Warning).
    - **C13**: 13 years and older.
    - **C16**: 16 years and older.
    - **C18**: 18 years and older.
- Update the Movie model/schema to strictly use these rating values.

### 2. Age Calculation
- Calculate the user's current age based on the `dateOfBirth` field in their profile and the current date.

### 3. Visual Indicators (Frontend)
- Display a clear age rating badge on:
    - Movie Cards (Home, Now Showing, Coming Soon).
    - Movie Details Page.
- The badge should be color-coded or styled according to common cinema standards (e.g., Green for P, Yellow/Orange for K/C13, Red for C16/C18).

### 4. Booking Restrictions (Frontend)
- On the Movie Details and Showtime selection pages:
    - If the user's age is below the required rating (C13, C16, C18):
        - Disable the "Book Ticket" button.
        - Display a tooltip or message explaining: "This movie is rated [Rating]. You must be at least [Age] years old to book."
    - If the movie is rated **K** and the user is under 13:
        - When the user clicks "Book Ticket", show a mandatory confirmation popup/checkbox: "I confirm that I will be accompanied by a parent or guardian for this 'K' rated movie."
        - Only allow proceeding to seat selection after confirmation.

### 5. Backend Validation (Security)
- Add a validation check in the Booking Service/Controller.
- Reject booking requests if the user's age does not meet the movie's rating requirements (except for **K** rating with acknowledgment, if applicable to backend logic).

## Non-Functional Requirements
- **Performance:** Age calculation should be efficient and not delay page loads.
- **UX:** Restrictions should be communicated clearly and politely to the user.

## Acceptance Criteria
- [ ] Movies display correct Vietnamese rating badges.
- [ ] Users under 18 cannot book C18 movies.
- [ ] Users under 16 cannot book C16 movies.
- [ ] Users under 13 cannot book C13 movies.
- [ ] Users under 13 receive a guardian warning for K movies but can still book.
- [ ] All users can book P movies.
- [ ] Backend prevents manual API requests that bypass frontend age restrictions.

## Out of Scope
- Age filtering for Guest/Anonymous users (to be handled in a future Guest Booking track).
- Automatic hiding of movies from the list (movies remain visible but unbookable).