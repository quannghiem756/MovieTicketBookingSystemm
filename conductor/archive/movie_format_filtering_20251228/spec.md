# Specification - Movie Format Filtering on Showtime Page

## Overview
This track aims to enhance the user experience on the `ShowtimesPage` by adding format-based filtering (e.g., 2D, 3D, IMAX) directly within each movie card. Users will be able to see which formats are available for a specific movie and filter the displayed showtimes accordingly.

## Functional Requirements
- **Dynamic Format Extraction:** For each movie card, the system must extract all unique `format` values (e.g., "2D", "3D", "IMAX") from its associated showtimes.
- **Format Selection UI:** Display available formats as selectable chips or buttons within the `ShowtimeMovieCard` component, positioned above the showtime list.
- **In-Card Filtering:** Clicking a format chip must filter the showtimes displayed *only within that specific movie card*.
- **Default Selection:** If a movie has multiple formats, the UI should default to selecting the first available format.
- **Empty State Handling:** If no showtimes match a selected format (which shouldn't happen with dynamic extraction), the UI should handle this gracefully.

## Non-Functional Requirements
- **Consistency:** Use Material UI (MUI) components (Chips, Stacks) to match the existing design language.
- **Responsiveness:** Ensure the format chips wrap correctly on smaller screens.
- **Performance:** Filtering should happen client-side within the component state for immediate feedback.

## Acceptance Criteria
- [ ] Each movie card on `/showtimes` shows format chips based on available showtimes.
- [ ] Clicking a format chip (e.g., "3D") updates the list of showtimes to show only 3D sessions for that movie.
- [ ] The filtering does not affect other movie cards on the page.
- [ ] If only one format is available, it is either clearly indicated or the selection UI is simplified.

## Out of Scope
- Global page-level filtering by format.
- Modification of the backend database schema (already supports `format`).
- Admin-side changes for format management.
