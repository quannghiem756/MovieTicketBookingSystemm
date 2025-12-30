# Plan - Movie Metadata Expansion in Vector Service

This plan outlines the steps to include `posterUrl`, `releaseDate`, `duration`, and `trailerUrl` in the `movie_vector_service` metadata.

## Phase 1: Preparation and Testing Setup [checkpoint: c60de5f]
- [x] Task: Analyze current metadata extraction in `movie_vector_service.py` 8598778
- [x] Task: Create a new test file `vector_service/tests/test_metadata_expansion.py` to verify the presence of new fields in search results. 8598778
- [x] Task: Conductor - User Manual Verification 'Preparation and Testing Setup' (Protocol in workflow.md) c7c5769

## Phase 2: Implementation (TDD) [checkpoint: 8eb4541]
- [x] Task: **Red Phase:** Run the new tests and confirm they fail because fields are missing. 2262357
- [x] Task: **Green Phase:** Update `build_vector_index` in `movie_vector_service.py` to include `posterUrl`, `releaseDate`, `duration`, and `trailerUrl` in document metadata. 1dc5856
- [x] Task: **Green Phase:** Update `search_similar_movies` and `get_movies` to extract these new fields from metadata. 1dc5856
- [x] Task: **Green Phase:** Run tests and verify they pass. 1dc5856
- [x] Task: **Refactor:** Clean up any redundant data mapping in `movie_vector_service.py`. 1dc5856
- [x] Task: Conductor - User Manual Verification 'Implementation' (Protocol in workflow.md) 8eb4541

## Phase 3: Validation and Index Rebuild
- [ ] Task: Start the `movie_vector_service` and trigger the `/rebuild-index` endpoint.
- [ ] Task: Verify via `curl` or Postman that the `/search` and `/movies` endpoints now return the complete metadata.
- [ ] Task: Conductor - User Manual Verification 'Validation and Index Rebuild' (Protocol in workflow.md)
