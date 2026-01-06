# Plan: Fix Refresh Token Race Condition and Loop

## Phase 1: Reproduction and Infrastructure [checkpoint: fd9b209]
- [x] Task: Create a reproduction test case for concurrent refresh token requests. 7f51380
- [x] Task: Update `RefreshTokenModel` and `RefreshTokenRepository` to support rotation grace periods. 822b574
- [x] Task: Conductor - User Manual Verification 'Phase 1: Reproduction and Infrastructure' (Protocol in workflow.md)

## Phase 2: Implementation of Grace Period Logic
- [~] Task: Update `AuthService.refreshTokens` to implement grace period logic.
    - Modify `refreshTokens` to check if a token was recently consumed (e.g., within the last 30 seconds).
    - If consumed recently, return the `replacedBy` token information instead of generating a new one or triggering reuse detection.
    - Ensure atomicity in the "mark as consumed and generate new" step to prevent multiple new tokens.
- [ ] Task: Verify fix with the reproduction test case.
    - Run the test case from Phase 1 and ensure it now passes (no 401, no session wipe, single new token).
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Implementation of Grace Period Logic' (Protocol in workflow.md)

## Phase 3: Final Integration and Cleanup
- [ ] Task: Add comprehensive unit tests for the new `AuthService` logic.
    - Test edge cases: expired grace period, truly stolen token reuse, expired tokens.
- [ ] Task: Run full backend test suite and check coverage.
    - Ensure `AuthService` and `RefreshTokenRepository` have >80% coverage.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Final Integration and Cleanup' (Protocol in workflow.md)