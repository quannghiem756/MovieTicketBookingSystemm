# Specification: Interactive Movie Cards in Recommendation Chat

## Overview
Enhance the `MovieRecommendationChat` component by replacing the text-only list of recommendations with interactive movie cards. These cards will allow users to view available formats and select showtimes directly within the chat interface, streamlining the booking process.

## Functional Requirements
1.  **Rich Media Recommendations:**
    -   When the chatbot identifies movie recommendations, it should display them as interactive cards instead of a plain text list.
    -   Each card must include: Poster image, Movie Title, Rating badge, Format selection chips, and clickable Showtime chips.
2.  **Showtime Integration:**
    -   The system must fetch and display future showtimes for each recommended movie.
    -   Users can filter showtimes by format (e.g., 2D, 3D, IMAX) directly on the card.
3.  **Direct Booking Flow:**
    -   Clicking a showtime chip on a movie card must navigate the user directly to the Seat Selection page (`/book/:movieId/:showtimeId`) for that specific showtime.
4.  **UI/UX Design:**
    -   **Layout:** Multiple recommendations must be displayed in a responsive 2-column grid within the chat window.
    -   **Context:** The bot should still provide a brief text response (e.g., "Here are some movies you might like:") before displaying the grid of cards.
    -   **Consistency:** The design should leverage existing components like `ShowtimeMovieCard` but optimized for the compact chat interface.

## Technical Requirements
-   **Frontend:**
    -   Update `MovieRecommendationChat.jsx` to handle structured movie data in messages.
    -   Create or adapt a compact version of `ShowtimeMovieCard` (e.g., `ChatMovieCard`) suitable for a 400px wide chat window.
    -   Ensure the chat window handles the increased height of messages containing cards with smooth auto-scrolling.
-   **Backend:**
    -   Update `RecommendationController.js` or create a wrapper to ensure recommended movie objects include their future showtimes, or ensure the frontend performs the necessary lookups via `getFutureShowtimesByMovieId`.

## Acceptance Criteria
-   [ ] Chatbot bot responses for recommendations contain interactive movie cards.
-   [ ] Each card correctly displays available formats and showtimes for the movie.
-   [ ] Clicking a format chip updates the visible showtimes on the card.
-   [ ] Clicking a showtime chip navigates the user to the correct booking page.
-   [ ] The cards are displayed in a 2-column grid.
-   [ ] The chat interface remains responsive and usable on both desktop and mobile.

## Out of Scope
-   In-chat seat selection (seat selection will still happen on the dedicated booking page).
-   Payment processing within the chat interface.
