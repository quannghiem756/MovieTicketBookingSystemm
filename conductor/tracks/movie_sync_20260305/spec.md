# Specification: Movie Vector Data Synchronization

## Overview
This track aims to automate the synchronization of movie data between the main MongoDB database (managed by the Node.js backend) and the vector database (ChromaDB, managed by the Python `vector_service`). Currently, movie data may be out of sync, requiring manual updates. This feature will introduce a webhook-style API in the `vector_service` that the Node.js backend can trigger whenever movie data is created, updated, or deleted.

## Functional Requirements
1.  **Vector Service API:**
    -   Create a new REST endpoint (e.g., `POST /sync/movie`) in `vector_service/movie_vector_service.py` to receive movie updates.
    -   The endpoint should handle `upsert` (insert if new, update if exists) and `delete` operations.
    -   The payload should include the movie `id`, `title`, `description`, `genre`, and any other relevant metadata for embeddings.
2.  **Node.js Backend Trigger:**
    -   Integrate a trigger mechanism in the `MovieService` (or relevant service) of the Node.js backend.
    -   When a movie is **created**, call the `vector_service` API with the new movie data.
    -   When a movie is **updated**, call the `vector_service` API with the updated movie data.
    -   When a movie is **deleted**, call the `vector_service` API with the movie `id` for removal.
3.  **Synchronization Logic:**
    -   **Insert/Update:** Re-calculate embeddings for the movie description/metadata and update the ChromaDB collection.
    -   **Delete:** Remove the corresponding entry from ChromaDB by movie `id`.
4.  **Error Handling & Logging:**
    -   The `vector_service` must log all synchronization attempts, successes, and failures.
    -   The Node.js backend should handle API failures gracefully (e.g., log error but don't crash the main operation).

## Acceptance Criteria
- [ ] A new movie created in the Admin Panel appears in the vector database and is searchable by the AI chatbot.
- [ ] Updates to a movie's description in the Admin Panel are reflected in the AI chatbot's responses.
- [ ] Deleting a movie in the Admin Panel removes it from the vector database.
- [ ] All synchronization events are logged in the `vector_service`.

## Out of Scope
- Full re-synchronization of the entire catalog (to be handled by a separate utility if needed).
- Real-time streaming (e.g., Kafka/RabbitMQ) for data sync; a simple HTTP webhook is sufficient for now.
