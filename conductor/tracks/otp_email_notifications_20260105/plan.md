# Plan: OTP Email Verification & Booking Notifications

## Phase 1: Email Infrastructure Setup
- [x] Task: Install `nodemailer` and `dotenv`. c02e164
- [x] Task: Configure Environment Variables for SMTP. b5a748d
    - Add `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` to `.env`.
- [ ] Task: Create Email Service Module.
    - Create `backend/src/infrastructure/EmailService.js`.
    - Implement `sendEmail(to, subject, html)` function.
    - Implement `verifyConnection()` to test SMTP config.
- [ ] Task: TDD - Email Service
    - Create `backend/src/infrastructure/tests/EmailService.test.js`.
    - Write tests for successful sending and error handling (mocking `nodemailer`).
- [ ] Task: Conductor - User Manual Verification 'Email Infrastructure Setup' (Protocol in workflow.md)

## Phase 2: OTP System Implementation
- [ ] Task: Create OTP Schema/Model (or extend User model).
    - Store `email`, `otpCode`, `expiresAt`.
- [ ] Task: Implement `OTPService.js`.
    - `generateOTP()`: Returns 6-digit code.
    - `saveOTP(email, otp)`: Stores in DB/Memory.
    - `verifyOTP(email, otp)`: Checks validity and expiration.
- [ ] Task: TDD - OTP Service
    - Create `backend/src/application/tests/OTPService.test.js`.
    - Test generation, storage, successful verification, expired OTP, and invalid OTP.
- [ ] Task: Conductor - User Manual Verification 'OTP System Implementation' (Protocol in workflow.md)

## Phase 3: Registration & Password Reset Integration
- [ ] Task: Modify Registration Flow.
    - Update `AuthService.js` to create inactive user or temporary registration state.
    - Send OTP upon registration request.
    - Create new endpoint `POST /api/auth/verify-email`.
- [ ] Task: Modify Password Reset Flow.
    - Create endpoint `POST /api/auth/forgot-password` (sends OTP).
    - Create endpoint `POST /api/auth/reset-password` (verifies OTP + new password).
- [ ] Task: TDD - Auth Integration
    - Update `backend/src/application/tests/AuthService.test.js`.
    - Test full flows: Register -> Verify -> Login.
    - Test Forgot Password -> Verify -> Login.
- [ ] Task: Conductor - User Manual Verification 'Registration & Password Reset Integration' (Protocol in workflow.md)

## Phase 4: Booking Notification Email
- [ ] Task: Create HTML Email Template.
    - Create `backend/src/templates/bookingEmail.html` (or a helper function to generate HTML).
    - Style to match `BookingConfirmation.jsx` (embed CSS inline).
- [ ] Task: Integrate QR Code Generation.
    - Ensure backend can generate QR code image (using `qrcode` lib) or embed frontend-generated data.
- [ ] Task: Integrate into Booking Flow.
    - Update `BookingService.js`.
    - Call `EmailService` after successful payment/booking creation.
- [ ] Task: TDD - Booking Notification
    - Update `backend/src/application/tests/BookingService.test.js`.
    - Verify `EmailService.sendEmail` is called with correct parameters after booking.
- [ ] Task: Conductor - User Manual Verification 'Booking Notification Email' (Protocol in workflow.md)
