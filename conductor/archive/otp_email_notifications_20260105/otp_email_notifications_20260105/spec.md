# Specification: OTP Email Verification & Booking Notifications

## Overview
Enhance system security and user experience by implementing OTP-based email verification for critical account actions and automated email notifications for ticket bookings.

## Functional Requirements

### 1. OTP Email Verification
- **Triggers:**
    - **User Registration:** Users must verify their email address via OTP before their account is fully activated.
    - **Password Reset:** Users must verify their identity via OTP before being allowed to set a new password.
- **OTP Characteristics:**
    - 6-digit numeric code.
    - 5-minute expiration time.
    - Secure generation and storage (temporary) on the backend.
- **Workflow:**
    1. User initiates action (Register/Reset Password).
    2. Backend generates OTP and sends it via Nodemailer (SMTP).
    3. User enters OTP in the frontend.
    4. Backend validates OTP and proceeds with the action if correct and not expired.

### 2. Booking Confirmation Emails
- **Trigger:** Sent automatically upon successful payment/booking confirmation.
- **Content:** Mimics the existing `BookingConfirmation.jsx` frontend layout.
    - Movie Title
    - Theater Name & Location
    - Show Date & Time
    - Selected Seats
    - Total Price
    - Booking ID
    - QR Code (for ticket validation)
- **Formatting:** Rich HTML email template designed to look professional and consistent with the brand.

### 3. Email Infrastructure
- **Provider:** Nodemailer using SMTP (configured for Gmail or similar).
- **Environment Variables:** Secure configuration for SMTP host, port, user, and password.

## Non-Functional Requirements
- **Security:** OTPs should be single-use and rate-limited to prevent brute-force attacks.
- **Reliability:** Email sending should be handled asynchronously (e.g., not blocking the main request-response cycle) where appropriate.
- **Scalability:** The email service should be modular to allow switching providers in the future.

## Acceptance Criteria
- [ ] New users cannot register without a valid email OTP.
- [ ] Password reset requires a valid email OTP.
- [ ] OTPs expire exactly after 5 minutes.
- [ ] Users receive a detailed HTML email immediately after a successful booking.
- [ ] Booking emails contain all relevant details and a scannable QR code.

## Out of Scope
- SMS-based OTP/Notifications.
- Advanced email analytics (open rates, click-through rates).
- User-customizable email notification preferences.
