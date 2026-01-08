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

## Phase 4: Frontend OTP Integration [checkpoint: c70e076]
- [x] Task: Update Frontend `AuthService.js` with new API endpoints. 4f476bd
- [x] Task: Update `RegisterPage.jsx` with OTP verification step. 376494e
- [x] Task: Update `LoginPage.jsx` with Forgot Password link. a91bc33
- [x] Task: Create `ResetPasswordPage.jsx` (or modal). a95d717
- [x] Task: Conductor - User Manual Verification 'Frontend OTP Integration' (Protocol in workflow.md) c70e076

## Phase 5: Booking Notification Email [checkpoint: 204d04f]
- [x] Task: Create HTML Email Template. 72e2f9c
- [x] Task: Integrate QR Code Generation. 72e2f9c
    - Ensure backend can generate QR code image (using `qrcode` lib) or embed frontend-generated data.
- [x] Task: Integrate into Booking Flow. be43fd8
    - Update `BookingService.js`.
    - Call `EmailService` after successful payment/booking creation.
- [x] Task: TDD - Booking Notification be43fd8
    - Update `backend/src/application/tests/BookingService.test.js`.
    - Verify `EmailService.sendEmail` is called with correct parameters after booking.
- [x] Task: Display QR Code on Booking Confirmation Page 1fcda61
    - Update `frontend/src/pages/BookingConfirmation.jsx` to use `qrcode.react`.
    - Display the booking ID as a QR code.
- [x] Task: Enhance Email Template 3f5ca9e
    - Add I18n support (EN/VI) to `EmailTemplates.js`.
    - Match email UI to Frontend Dark Theme.
    - Pass language param from `BookingService.js`.
- [x] Task: Fix QR Code Display in Email af8da62
    - Use `attachments` and `cid` for QR code image in `EmailTemplates.js`.
    - Update `EmailService.js` to support attachments.
    - Revert layout to Red Gradient style.
- [x] Task: Conductor - User Manual Verification 'Booking Notification Email' (Protocol in workflow.md) be43fd8