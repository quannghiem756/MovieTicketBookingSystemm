# Specification: Redirect Unverified Users to OTP Verification

## Overview
Currently, when a user tries to log in with an unverified email, the system returns a generic 500 error with the message "Email not verified". This provides a poor user experience. This track aims to catch this state, redirect the user to the verification form, and automatically trigger a new OTP so they can complete their registration immediately.

## Functional Requirements

### Backend Enhancements
1.  **Status Code Update**: Change the response status code for "Email not verified" errors during login from `500 Internal Server Error` to `403 Forbidden`.
2.  **Resend OTP Endpoint**: Implement a new endpoint `POST /api/users/resend-verification-otp` that:
    -   Accepts an `email`.
    -   Verifies the user exists and is currently unverified.
    -   Generates and sends a new OTP for the `registration` purpose.
    -   Uses the existing `OTPService` and `EmailService`.

### Frontend Enhancements
1.  **Login Logic**:
    -   Update `LoginPage` to detect the `403 Forbidden` status during the login process.
    -   If detected, redirect the user to `/register` using `react-router-dom`'s `navigate`, passing the `email` and an `otpMode: true` flag in the navigation state.
2.  **Register Page Refactoring**:
    -   Modify `RegisterPage` to check for `otpMode` in the location state upon mounting.
    -   If `otpMode` is true:
        -   Set the internal step to `'otp'`.
        -   Populate the email field in `formData` from the navigation state.
        -   Automatically trigger the "Resend OTP" API call.
3.  **OTP Form Improvements**:
    -   Implement a "Resend OTP" button on the OTP verification step.
    -   Add a 60-second cooldown timer to the "Resend OTP" button to prevent spam and provide visual feedback to the user.

## Non-Functional Requirements
-   **User Feedback**: Provide clear success/error messages for both the automatic and manual OTP resend actions.
-   **Security**: Ensure the resend endpoint is rate-limited (cooldown timer on UI helps, but backend should ideally have basic protection).

## Acceptance Criteria
1.  An unverified user attempts to log in with correct credentials.
2.  The user is automatically redirected to the OTP verification step on the Registration page.
3.  A "New OTP sent to your email" message appears, and the user receives the email.
4.  The "Resend OTP" button is disabled for 60 seconds after the automatic send.
5.  Entering the correct OTP successfully verifies the account and redirects to the login page with a success message.
6.  The user can then log in successfully.

## Out of Scope
-   Changes to the password reset OTP flow.
-   Modifying the registration form fields.
