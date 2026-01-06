# Specification - Fix Refresh Token Race Condition and Loop

## Overview
The current refresh token implementation in `AuthService` is susceptible to race conditions when multiple concurrent refresh requests are made with the same token. This results in "reuse detection" being triggered prematurely, deleting all user sessions and forcing a logout (401 error). Additionally, it seems to be creating multiple refresh tokens in the database during this process.

## Functional Requirements
1. **Concurrency Handling:** Implement a mechanism to handle concurrent refresh requests gracefully.
2. **Grace Period:** Introduce a short grace period (e.g., 10-30 seconds) where a recently rotated refresh token is still considered valid for "one-time" use by late-arriving concurrent requests.
3. **Prevent Flooding:** Ensure that only one new refresh token pair is generated even if multiple concurrent requests are processed.
4. **Logging:** Add logging to track refresh token rotation and reuse detection triggers for better debugging.

## Non-Functional Requirements
1. **Security:** Maintain reuse detection to prevent malicious token theft and reuse.
2. **Performance:** The fix should not significantly increase the latency of the `/refresh` endpoint.

## Acceptance Criteria
1. Simultaneous refresh requests with the same valid token do not trigger immediate logout for all sessions.
2. Only one new refresh token is persisted in the database after a successful rotation involving concurrent requests.
3. The user remains logged in after the rotation completes.
4. Invalid tokens (older than the grace period or completely fake) still trigger reuse detection and logout.

## Out of Scope
- Major changes to the frontend client logic (aiming for a robust backend fix).
- Changes to other authentication methods (Google OAuth).