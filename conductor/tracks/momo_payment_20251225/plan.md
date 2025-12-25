# Track Plan: Refine MoMo Payment Integration

## Phase 1: Analysis & Configuration Verification [checkpoint: aef6cf8]
- [x] Task: Analyze existing `PaymentService.js` and `paymentRoutes.js` to understand the current implementation. [fe71b9e]
- [x] Task: Verify `.env` configuration for MoMo credentials (ensure keys are present and correct). [fe71b9e]
- [x] Task: Conductor - User Manual Verification 'Analysis & Configuration Verification' (Protocol in workflow.md) [aef6cf8]

## Phase 2: Payment Initiation (Backend) [checkpoint: effdf6e]
- [x] Task: Write Unit Tests for `PaymentService.createPaymentRequest` to verify payload construction and signature generation. [aef6cf8]
- [x] Task: Refactor/Implement `createPaymentRequest` in `PaymentService.js` to ensure compliance with MoMo API. [aef6cf8]
- [x] Task: Conductor - User Manual Verification 'Payment Initiation (Backend)' (Protocol in workflow.md) [effdf6e]

## Phase 3: Callback & IPN Handling (Backend) [checkpoint: 2ca352e]
- [x] Task: Write Unit Tests for `PaymentService.verifySignature` to ensure incoming IPN requests are authentic. [effdf6e]
- [x] Task: Write Unit Tests for `PaymentService.processPaymentResult` to verify booking status updates based on IPN codes. [effdf6e]
- [x] Task: Implement/Refactor `paymentRoutes.js` to handle the callback endpoint (IPN) and update booking status securely. [effdf6e]
- [x] Task: Ensure idempotency in the callback handler (prevent double-processing of the same order). [effdf6e]
- [x] Task: Conductor - User Manual Verification 'Callback & IPN Handling (Backend)' (Protocol in workflow.md) [2ca352e]

## Phase 4: Frontend Integration & User Experience
- [ ] Task: Review `PaymentResult.jsx` and ensure it correctly interprets the query parameters returned by MoMo.
- [ ] Task: Update the frontend booking flow to redirect to the MoMo payment URL upon booking confirmation.
- [ ] Task: Conductor - User Manual Verification 'Frontend Integration & User Experience' (Protocol in workflow.md)

## Phase 5: Integration Testing
- [ ] Task: Perform an end-to-end test of the payment flow (Booking -> Payment -> Callback -> Success Page).
- [ ] Task: Test edge cases: User cancels payment, network failure during callback, invalid signature.
- [ ] Task: Conductor - User Manual Verification 'Integration Testing' (Protocol in workflow.md)
