# Specification: Recommendation Chatbot Edge Case Testing (LLM + RAG)

## Overview
This track focuses on evaluating the robustness, safety, and reliability of the LLM-based recommendation chatbot. Given its integration with RAG (Retrieval-Augmented Generation), we need to ensure it handles "garbage" inputs, data conflicts, and boundary conditions gracefully without hallucinating or breaking character.

## Functional Requirements
- **Edge Case Coverage:**
    - **Empty Retrieval:** No relevant context found in the vector database.
    - **Context Overflow:** Retrieved documents exceed context window limits.
    - **Conflicting Info:** Contradictory data within retrieved documents.
    - **Off-Topic/Out-of-Domain:** Queries unrelated to movie booking.
    - **Prompt Injection:** Malicious attempts to bypass system prompts.
    - **Ambiguity:** Vague queries (e.g., "show me something").
- **Strict Refusal Policy:** The chatbot must politely refuse to answer off-topic or out-of-domain queries and stay strictly within its defined persona.
- **Evaluation Mechanism:** Implement an "LLM-as-a-Judge" system (using a separate LLM instance) to evaluate responses.

## Non-Functional Requirements
- **Consistency:** The system should produce deterministic-like results (minimal variance in scores for identical inputs).
- **Safety:** Zero tolerance for successful prompt injections or harmful content.

## Acceptance Criteria
- [ ] A test suite of prompt edge cases is defined.
- [ ] An automated or semi-automated script is created to run these prompts against the recommendation service.
- [ ] A "Judge" LLM script is implemented to grade responses based on:
    - **Groundedness:** No hallucinations.
    - **Safety:** Proper refusal of bad inputs.
    - **Helpfulness:** Politeness in refusal.
    - **Consistency:** Reliability of scoring.
    - **Relevance:** Intent recognition.
- [ ] A final report is generated summarizing the pass/fail rate for each category.

## Out of Scope
- Performance benchmarking (latency/throughput).
- Fine-tuning the primary model (this track is for *testing* only).
- UI/UX improvements to the chat interface.
