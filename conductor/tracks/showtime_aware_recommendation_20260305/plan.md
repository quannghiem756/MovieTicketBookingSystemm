# Implementation Plan: Showtime-Aware Recommendation Filter

## Phase 1: Research & Setup [checkpoint: d29ea4e]
- [x] Task: Research Backend API logic for `/api/movies/now-showing` to confirm it only returns movies with showtimes today.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Research & Setup' (Protocol in workflow.md)

## Phase 2: Implementation (TDD) [checkpoint: 5523a46]
- [x] Task: Create unit tests for showtime-aware filtering in `vector_service/tests/test_showtime_filter.py`.
    - [x] Sub-task: Mock backend API responses for "now showing" movies.
    - [x] Sub-task: Test filtering logic for various scenarios (showing today, not showing today, empty list).
- [x] Task: Implement `get_now_showing_ids()` function in `movie_vector_service.py` to fetch movie IDs from the backend.
- [x] Task: Update `search_similar_movies()` to support an optional `filter_ids` list.
- [x] Task: Modify `get_recommendations()` to fetch "now showing" IDs and pass them to `search_similar_movies()` for pre-filtering.
- [x] Task: Verify all unit tests pass and code coverage is >80%.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Implementation' (Protocol in workflow.md)

## Phase 3: Integration & Final Validation
- [ ] Task: Verify the end-to-end flow by running the vector service and making recommendation requests.
- [ ] Task: Ensure the service handles backend API failures gracefully by returning an empty list (as per spec).
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Integration & Final Validation' (Protocol in workflow.md)
