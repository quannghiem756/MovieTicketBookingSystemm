# Implementation Plan: Interactive Movie Cards in Recommendation Chat

## Phase 1: Backend Enhancement - Recommendation Data
This phase focuses on ensuring the recommendation API returns movie data with associated future showtimes to minimize frontend requests.

- [x] Task: Update `RecommendationController` to fetch future showtimes for each recommended movie. [12b70b7]
- [x] Task: Write unit tests to verify the recommendation response includes a `showtimes` array for each movie. [12b70b7]
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Backend Enhancement' (Protocol in workflow.md)

## Phase 2: Frontend Component - ChatMovieCard
This phase involves creating a specialized, compact version of the `ShowtimeMovieCard` for the chat interface.

- [ ] Task: Create `ChatMovieCard.jsx` as a compact 2-column compatible version of `ShowtimeMovieCard`.
- [ ] Task: Implement format filtering and showtime selection logic within `ChatMovieCard`.
- [ ] Task: Write unit tests for `ChatMovieCard` ensuring correct navigation to `/book/:movieId/:showtimeId`.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Frontend Component' (Protocol in workflow.md)

## Phase 3: Frontend Integration - RecommendationChat
This phase integrates the new cards into the existing chat interface and updates the message handling logic.

- [ ] Task: Update `MovieRecommendationChat.jsx` state to support a `movies` array in message objects.
- [ ] Task: Refactor `handleSendMessage` to parse the backend response and store recommended movie objects.
- [ ] Task: Implement the 2-column grid rendering logic for movie recommendations in the chat history.
- [ ] Task: Adjust chat window styling for better scrolling and display of rich media messages.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Frontend Integration' (Plan in workflow.md)

## Phase 4: Final Verification & Polishing
Final end-to-end testing and UI refinements.

- [ ] Task: Verify the full "Chat -> Card -> Showtime -> Seat Selection" flow.
- [ ] Task: Ensure responsive behavior on mobile devices (single column grid in chat if necessary).
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Final Verification' (Protocol in workflow.md)
