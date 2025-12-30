# Specification: Chatbot Optimization (Groundedness & Reliability)

## Overview
This track addresses critical failures identified during edge case testing of the recommendation chatbot. The primary goals are to eliminate hallucinations, handle off-topic queries gracefully, prevent prompt injections, and improve response reliability for vague queries.

## Functional Requirements
- **Intent Classification Layer:**
    - Implement a pre-check mechanism to classify incoming queries as `movie_recommendation`, `off_topic`, or `malicious`.
    - Off-topic or malicious queries must be met with a standard, polite refusal message without triggering a vector search.
- **Strict Grounding (System Prompt):**
    - Update the system prompt to explicitly forbid recommending any movie not present in the provided context.
    - Include persona defense instructions to ignore attempts to reveal system prompts or change the assistant's role.
- **Vague Query Handling & Performance:**
    - Increase the service request timeout from 30s to 60s.
    - Implement a "Trending/Popular" fallback: if a query is too vague (e.g., "good movie") or the vector search returns low-confidence results, the system should return a set of curated popular movies instead of timing out or returning irrelevant data.

## Non-Functional Requirements
- **Reliability:** Reduce timeout failures (HTTP 504) by at least 80%.
- **Groundedness:** Achieve a Groundedness score of 5/5 in subsequent edge case tests.

## Acceptance Criteria
- [ ] Off-topic queries (e.g., "How to bake a cake?") receive a refusal message.
- [ ] Vague queries (e.g., "recommend a movie") return popular movies without timing out.
- [ ] Prompt injection attempts (e.g., "ignore previous instructions") are neutralized.
- [ ] The chatbot no longer recommends movies that are not in the database/context.

## Out of Scope
- Adding new movies to the database.
- Modifying the frontend UI components.
