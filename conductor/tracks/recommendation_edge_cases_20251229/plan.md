# Plan: Recommendation Chatbot Edge Case Testing

## Phase 1: Test Infrastructure & Dataset Setup
- [x] Task: Define a structured dataset of edge case prompts in `vector_service/tests/edge_cases.json` covering all categories (Empty Retrieval, Overflow, Conflict, Off-Topic, Injection, Ambiguity). a58f3bd
- [x] Task: Create the "Judge" evaluation script `vector_service/evaluator.py` using Gemini 1.5 Pro to grade responses based on the defined criteria (Groundedness, Safety, Helpfulness, Consistency, Relevance). 254199e
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Test Infrastructure & Dataset Setup' (Protocol in workflow.md)

## Phase 2: Test Execution Engine
- [ ] Task: Implement a test runner `vector_service/run_edge_tests.py` that iterates through the dataset, calls the recommendation API, and logs the raw responses.
- [ ] Task: Integrate the `evaluator.py` into the test runner to automatically score each response after it is received.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Test Execution Engine' (Protocol in workflow.md)

## Phase 3: Evaluation & Reporting
- [ ] Task: Execute the full edge case test suite and capture the results in a raw JSON format.
- [ ] Task: Create a report generator `vector_service/generate_report.py` that parses the evaluation results and outputs a human-readable Markdown summary.
- [ ] Task: Analyze the final report and identify any critical failures or hallucinations.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Evaluation & Reporting' (Protocol in workflow.md)
