# Plan: Fix Refresh Token Race Condition and Loop

## Phase 1: Reproduction and Infrastructure [checkpoint: fd9b209]
- [x] Task: Create a reproduction test case for concurrent refresh token requests. 7f51380
- [x] Task: Update `RefreshTokenModel` and `RefreshTokenRepository` to support rotation grace periods. 822b574
- [x] Task: Conductor - User Manual Verification 'Phase 1: Reproduction and Infrastructure' (Protocol in workflow.md)

## Phase 2: Implementation of Grace Period Logic [checkpoint: ab169be]
- [x] Task: Update `AuthService.refreshTokens` to implement grace period logic. e58f0ac
- [x] Task: Verify fix with the reproduction test case. e58f0ac
- [x] Task: Conductor - User Manual Verification 'Phase 2: Implementation of Grace Period Logic' (Protocol in workflow.md)

## Phase 3: Final Integration and Cleanup
- [~] Task: Add comprehensive unit tests for the new `AuthService` logic.
    - Test edge cases: expired grace period, truly stolen token reuse, expired tokens.
- [ ] Task: Run full backend test suite and check coverage.
    - Ensure `AuthService` and `RefreshTokenRepository` have >80% coverage.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Final Integration and Cleanup' (Protocol in workflow.md)