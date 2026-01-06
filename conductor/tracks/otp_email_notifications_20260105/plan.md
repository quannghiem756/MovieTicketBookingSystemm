# Plan: OTP Email Verification & Booking Notifications

## Phase 1: Email Infrastructure Setup [checkpoint: e2a4d02]
- [x] Task: Install `nodemailer` and `dotenv`. c02e164
- [x] Task: Configure Environment Variables for SMTP. b5a748d
    - Add `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` to `.env`.
- [x] Task: Create Email Service Module. 377472c
- [x] Task: TDD - Email Service 377472c
- [x] Task: Conductor - User Manual Verification 'Email Infrastructure Setup' (Protocol in workflow.md) e2a4d02

## Phase 2: OTP System Implementation [checkpoint: 3c88f6b]
- [x] Task: Create OTP Schema/Model (or extend User model). 93acae4
- [x] Task: Implement `OTPService.js`. 93acae4
- [x] Task: TDD - OTP Service 93acae4
- [x] Task: Conductor - User Manual Verification 'OTP System Implementation' (Protocol in workflow.md) 3c88f6b

## Phase 3: Registration & Password Reset Integration [checkpoint: 531ccd2]
- [x] Task: Modify Registration Flow. 12b91ac
- [x] Task: Modify Password Reset Flow. 12b91ac
- [x] Task: TDD - Auth Integration 12b91ac
- [x] Task: Conductor - User Manual Verification 'Registration & Password Reset Integration' (Protocol in workflow.md) 531ccd2

## Phase 4: Frontend OTP Integration
- [x] Task: Update Frontend `AuthService.js` with new API endpoints. 4f476bd
- [x] Task: Update `RegisterPage.jsx` with OTP verification step. 376494e
- [x] Task: Update `LoginPage.jsx` with Forgot Password link. a91bc33
- [ ] Task: Create `ResetPasswordPage.jsx` (or modal).
- [ ] Task: Conductor - User Manual Verification 'Frontend OTP Integration' (Protocol in workflow.md)

## Phase 5: Booking Notification Email
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