# Plan: Auth System Upgrade

## Phase 1: Infrastructure & Models
- [x] Task: Create `RefreshToken` model and repository. (0ec43ff)
- [ ] Task: Install necessary dependencies (`google-auth-library`, `cookie-parser`).
- [ ] Task: Conductor - User Manual Verification 'Infrastructure & Models' (Protocol in workflow.md)

## Phase 2: Backend Refresh Token Logic
- [ ] Task: Update `AuthService` to manage database-backed tokens and rotation.
- [ ] Task: Update `UserController` and middleware to handle cookies and rotation endpoints.
- [ ] Task: Conductor - User Manual Verification 'Backend Refresh Token Logic' (Protocol in workflow.md)

## Phase 3: Google OAuth Integration
- [ ] Task: Implement Google Token verification logic in `AuthService`.
- [ ] Task: Create `POST /api/users/google-login` endpoint that handles both login and auto-registration.
- [ ] Task: Conductor - User Manual Verification 'Google OAuth Integration' (Protocol in workflow.md)

## Phase 4: Frontend Integration
- [ ] Task: Update Axios interceptors for automatic refresh using cookies (`withCredentials: true`).
- [ ] Task: Add Google Login button to the Login page and integrate Google Identity Services.
- [ ] Task: Update `AuthContext` to handle the new session management logic.
- [ ] Task: Conductor - User Manual Verification 'Frontend Integration' (Protocol in workflow.md)

## Phase 5: Final Verification
- [ ] Task: Test security (XSS protection, token reuse detection).
- [ ] Task: Verify auto-registration flow for first-time Google users.
- [ ] Task: Conductor - User Manual Verification 'Final Verification' (Protocol in workflow.md)
