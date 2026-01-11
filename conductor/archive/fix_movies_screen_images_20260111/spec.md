# Specification: Fix Image URLs on Movies Screen

## Overview
Ensure that movie posters on the `MoviesScreen` correctly handle relative URLs starting with `/uploads` by prepending the backend API URL, consistent with `HomeScreen` and `MovieDetailsScreen`.

## Functional Requirements
- **Image URL Processing:**
    - If a movie's `posterUrl` starts with `/uploads`, prepend the `BACKEND_URL`.
    - Otherwise, use the URL as is.

## Acceptance Criteria
- [ ] Movies with local upload paths display correctly on the Movies Screen.
