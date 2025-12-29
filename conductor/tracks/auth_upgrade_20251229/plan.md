# Plan: Auth System Upgrade

## Phase 1: Infrastructure & Models [checkpoint: e29f88d]
- [x] Task: Create `RefreshToken` model and repository. (0ec43ff)
- [x] Task: Install necessary dependencies (`google-auth-library`, `cookie-parser`). (fbce347)
- [ ] Task: Conductor - User Manual Verification 'Infrastructure & Models' (Protocol in workflow.md)

## Phase 2: Backend Refresh Token Logic [checkpoint: 215660c]
- [x] Task: Update `AuthService` to manage database-backed tokens and rotation. (ffaccb6)
- [x] Task: Update `UserController` and middleware to handle cookies and rotation endpoints. (fc7ae30)
- [ ] Task: Conductor - User Manual Verification 'Backend Refresh Token Logic' (Protocol in workflow.md)

## Phase 3: Google OAuth Integration [checkpoint: c0e553a]
- [x] Task: Implement Google Token verification logic in `AuthService`. (0423c32)
- [x] Task: Create `POST /api/users/google-login` endpoint that handles both login and auto-registration. (dc57967)
- [ ] Task: Conductor - User Manual Verification 'Google OAuth Integration' (Protocol in workflow.md)

## Phase 4: Frontend Integration
- [x] Task: Update Axios interceptors for automatic refresh using cookies (`withCredentials: true`). (71a465b)
- [x] Task: Add Google Login button to the Login page and integrate Google Identity Services. (71a465b)
- [x] Task: Update `AuthContext` to handle the new session management logic. (71a465b)
- [ ] Task: Conductor - User Manual Verification 'Frontend Integration' (Protocol in workflow.md)

## Phase 5: Final Verification
- [ ] Task: Test security (XSS protection, token reuse detection).
- [ ] Task: Verify auto-registration flow for first-time Google users.
- [ ] Task: Conductor - User Manual Verification 'Final Verification' (Protocol in workflow.md)
