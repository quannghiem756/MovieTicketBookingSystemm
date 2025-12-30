# Specification - Movie Metadata Expansion in Vector Service

## Overview
Currently, the `movie_vector_service` only stores a limited subset of movie data in its vector database (ChromaDB). This prevents the AI chatbot from displaying rich information like poster images, trailers, and duration in its recommendations. This track will expand the metadata schema to include these missing fields.

## Functional Requirements
1.  **Metadata Expansion:** Update `build_vector_index` in `movie_vector_service.py` to include the following fields in the ChromaDB metadata:
    - `posterUrl`
    - `releaseDate`
    - `duration`
    - `trailerUrl`
2.  **Retrieval Update:** Update `search_similar_movies`, `get_movies`, and any fallback mechanisms (like `get_recommendations` fallback) to correctly extract and return these new metadata fields.
3.  **Data Consistency:** Ensure that when the main API is queried for movies, these new fields are correctly mapped to the vector store documents.
4.  **Index Rebuild:** Provide a way to trigger a re-indexing of the existing movies to populate the new metadata fields.

## Non-Functional Requirements
- **Performance:** Adding these fields to metadata should have negligible impact on search latency.
- **Backward Compatibility:** Existing chatbot logic should not break; it will simply start receiving more data.

## Acceptance Criteria
- [ ] Calling the `/search` or `/recommend` endpoints on the vector service returns movies including `posterUrl`, `releaseDate`, `duration`, and `trailerUrl`.
- [ ] The `/movies` endpoint returns the expanded metadata for all indexed movies.
- [ ] A successful call to `/rebuild-index` populates the new fields for all current movies in the database.

## Out of Scope
- Modifying the frontend UI to display these new fields (this track focuses on the backend service).
- Modifying the main backend API.
