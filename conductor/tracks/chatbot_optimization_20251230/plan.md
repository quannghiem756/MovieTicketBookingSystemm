# Plan: Chatbot Optimization (Groundedness & Reliability)

## Phase 1: Intent Classification & Refusal Logic
- [x] Task: Create a new module `vector_service/intent_classifier.py` to classify user queries into categories (`movie_recommendation`, `off_topic`, `malicious`). 9903af5
- [x] Task: Write unit tests in `vector_service/tests/test_intent_classifier.py` to verify classification of various edge case prompts. 9903af5
- [x] Task: Implement the classifier logic using a lightweight LLM call or robust pattern matching. 9903af5
- [x] Task: Integrate the classifier into the main request flow in `movie_vector_service.py` to return early refusals for off-topic/malicious queries. 9903af5
- [x] Task: Conductor - User Manual Verification 'Phase 1: Intent Classification & Refusal Logic' (Protocol in workflow.md) 7f817b3

## Phase 2: System Prompt Strengthening & Grounding
- [x] Task: Update the system prompt in `movie_vector_service.py` with strict grounding rules ("Only use provided context") and persona defense instructions. 4a8acd2
- [x] Task: Write failing integration tests in `vector_service/tests/test_grounding.py` that expect refusals when context doesn't match the query. 4a8acd2
- [x] Task: Refine the LLM prompt until all grounding tests pass and hallucinations are eliminated in local runs. 4a8acd2
- [x] Task: Conductor - User Manual Verification 'Phase 2: System Prompt Strengthening & Grounding' (Protocol in workflow.md) 4a8acd2

## Phase 3: Performance & Vague Query Fallback
- [ ] Task: Increase the timeout configuration in `movie_vector_service.py` and any associated client-side calls (if applicable) to 60s.
- [ ] Task: Implement a `get_popular_movies()` fallback method that retrieves a curated list of trending films from the database.
- [ ] Task: Update the RAG logic to detect vague queries or low-confidence vector results and trigger the popular fallback.
- [ ] Task: Verify with a test script that "good movie" now returns results within the new timeout window.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Performance & Vague Query Fallback' (Protocol in workflow.md)

## Phase 4: Final Validation & Regression Testing
- [ ] Task: Re-run the full edge case test suite using `vector_service/run_edge_tests.py`.
- [ ] Task: Generate a new `edge_case_report.md` using `vector_service/generate_report.py` and verify scores have improved.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Final Validation & Regression Testing' (Protocol in workflow.md)
