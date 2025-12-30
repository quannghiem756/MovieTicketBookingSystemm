# Plan: Recommendation Chatbot Edge Case Testing

## Phase 1: Test Infrastructure & Dataset Setup [checkpoint: 31d27b9]
- [x] Task: Define a structured dataset of edge case prompts in `vector_service/tests/edge_cases.json` covering all categories (Empty Retrieval, Overflow, Conflict, Off-Topic, Injection, Ambiguity). a58f3bd
- [x] Task: Create the "Judge" evaluation script `vector_service/evaluator.py` using OpenAI (GPT-4o) to grade responses based on the defined criteria (Groundedness, Safety, Helpfulness, Consistency, Relevance). 7e9b9b4
- [x] Task: Conductor - User Manual Verification 'Phase 1: Test Infrastructure & Dataset Setup' (Protocol in workflow.md)

## Phase 2: Test Execution Engine [checkpoint: 5a1ae29]
- [x] Task: Implement a test runner `vector_service/run_edge_tests.py` that iterates through the dataset, calls the recommendation API, and logs the raw responses. 5997163
- [x] Task: Integrate the `evaluator.py` into the test runner to automatically score each response after it is received. 5997163
- [x] Task: Conductor - User Manual Verification 'Phase 2: Test Execution Engine' (Protocol in workflow.md)

## Phase 3: Evaluation & Reporting
- [x] Task: Execute the full edge case test suite and capture the results in a raw JSON format.
- [x] Task: Create a report generator `vector_service/generate_report.py` that parses the evaluation results and outputs a human-readable Markdown summary.
- [x] Task: Analyze the final report and identify any critical failures or hallucinations.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Evaluation & Reporting' (Protocol in workflow.md)
