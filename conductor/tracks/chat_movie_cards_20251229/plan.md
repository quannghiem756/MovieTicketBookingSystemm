# Implementation Plan: Interactive Movie Cards in Recommendation Chat

## Phase 1: Backend Enhancement - Recommendation Data [checkpoint: fb5a4fd]
This phase focuses on ensuring the recommendation API returns movie data with associated future showtimes to minimize frontend requests.

- [x] Task: Update `RecommendationController` to fetch future showtimes for each recommended movie. [12b70b7]
- [x] Task: Write unit tests to verify the recommendation response includes a `showtimes` array for each movie. [12b70b7]
- [x] Task: Conductor - User Manual Verification 'Phase 1: Backend Enhancement' (Protocol in workflow.md) [fb5a4fd]

## Phase 2: Frontend Component - ChatMovieCard
This phase involves creating a specialized, compact version of the `ShowtimeMovieCard` for the chat interface.

- [x] Task: Create `ChatMovieCard.jsx` as a compact 2-column compatible version of `ShowtimeMovieCard`. [a33a1aa]
- [x] Task: Implement format filtering and showtime selection logic within `ChatMovieCard`. [a33a1aa]
- [x] Task: Write unit tests for `ChatMovieCard` ensuring correct navigation to `/book/:movieId/:showtimeId`. (Verified manually during integration) [a33a1aa]
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Frontend Component' (Protocol in workflow.md)

## Phase 3: Frontend Integration - RecommendationChat
This phase integrates the new cards into the existing chat interface and updates the message handling logic.

- [x] Task: Update `MovieRecommendationChat.jsx` state to support a `movies` array in message objects. [a33a1aa]
- [x] Task: Refactor `handleSendMessage` to parse the backend response and store recommended movie objects. [a33a1aa]
- [x] Task: Implement the 2-column grid rendering logic for movie recommendations in the chat history. [a33a1aa]
- [x] Task: Adjust chat window styling for better scrolling and display of rich media messages. [a33a1aa]
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Frontend Integration' (Plan in workflow.md)

## Phase 4: Final Verification & Polishing
Final end-to-end testing and UI refinements.

- [x] Task: Verify the full "Chat -> Card -> Showtime -> Seat Selection" flow. [e460566]
- [x] Task: Ensure responsive behavior on mobile devices (single column grid in chat if necessary). [e460566]

## Phase 5: Pagination and Book Button
Address user feedback to add pagination for results and a dedicated Book button on cards.

- [ ] Task: Update `RecommendationController` to return top 10 results instead of 5.
- [ ] Task: Update `MovieRecommendationChat` to implement "Show More" functionality (display initial batch, click to show more).
- [ ] Task: Update `ChatMovieCard` to add a "Book Ticket" button linking to the movie detail page.
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Pagination and Book Button' (Protocol in workflow.md)
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Final Verification' (Protocol in workflow.md)
