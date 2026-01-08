# Implementation Plan: Redirect Unverified Users to OTP Verification

## Phase 1: Backend Infrastructure [checkpoint: 0b1c7f8]
- [x] Task: Update `UserController.authenticateUser` to return `403 Forbidden` when `userService.authenticateUser` throws "Email not verified". eda092f
- [x] Task: Implement `resendVerificationOTP` method in `UserController` to handle sending a new OTP. eda092f
- [x] Task: Add `POST /api/users/resend-verification-otp` route in `backend/src/interfaces/http/routes/users.js`. 9430d2d
- [x] Task: Conductor - User Manual Verification 'Phase 1: Backend Infrastructure' (Protocol in workflow.md) 0b1c7f8

## Phase 2: Frontend Redirection & OTP Mode
- [x] Task: Update `AuthContext.jsx`'s `login` function to return the full error response when it fails, allowing the caller to check the status code. 6b495e6
- [x] Task: Update `LoginPage.jsx` to catch `403` errors and redirect to `/register` with `state: { email, otpMode: true }`. 1f312f7
- [ ] Task: Refactor `RegisterPage.jsx` to check `location.state` for `otpMode` and `email` on mount, setting the internal step to `'otp'`.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Frontend Redirection & OTP Mode' (Protocol in workflow.md)

## Phase 3: Resend OTP Logic & UI
- [ ] Task: Add `resendVerificationOTP` function to `frontend/src/services/api.js`.
- [ ] Task: Implement `handleResendOTP` in `RegisterPage.jsx` and trigger it automatically when `otpMode` is detected on mount.
- [ ] Task: Add a "Resend OTP" button to the OTP step in `RegisterPage.jsx` with a 60-second cooldown timer.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Resend OTP Logic & UI' (Protocol in workflow.md)
