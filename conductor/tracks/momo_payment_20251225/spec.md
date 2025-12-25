# Track Specification: Refine MoMo Payment Integration

## 1. Goal
To ensure the MoMo payment integration is robust, secure, and provides a seamless user experience. This involves verifying the payment request generation, handling the callback/IPN (Instant Payment Notification) correctly to update booking status, and managing edge cases like payment failures or timeouts.

## 2. Context
The current system uses MoMo for payments. We need to verify the existing implementation against MoMo's API standards and ensure that the booking system accurately reflects the payment status in real-time.

## 3. Core Requirements
- **Payment Request:** accurately generate a payment URL with correct amount, orderId, and return URL.
- **Callback Handling:** Securely receive and validate the IPN from MoMo (checking signatures).
- **Status Updates:** Update the booking status in the database (Pending -> Paid/Failed) based on the IPN result.
- **User Feedback:** Redirect the user to an appropriate success or failure page after the transaction.
- **Security:** Ensure secret keys and access keys are stored safely in `.env` and not exposed.

## 4. Key Files & Services
- `backend/src/application/PaymentService.js`: Core logic for interacting with MoMo.
- `backend/src/infrastructure/repositories/MongoBookingRepository.js`: Updating booking records.
- `backend/src/interfaces/paymentRoutes.js`: API endpoints for payment initiation and callbacks.
- `frontend/src/pages/PaymentResult.jsx`: UI for displaying the transaction outcome.
- `backend/.env`: Configuration for MoMo credentials.

## 5. Non-Functional Requirements
- **Reliability:** The callback handler must be idempotent to handle duplicate notifications from MoMo.
- **Security:** Validate all incoming requests from MoMo using the provided signature.
- **Logging:** log all payment attempts and IPN payloads for auditing and debugging.
