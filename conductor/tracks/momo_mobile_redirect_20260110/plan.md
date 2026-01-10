# Track Plan: Dynamic MoMo Redirect for Mobile and Web

This track implements dynamic redirect URLs for MoMo payments to support mobile app (Expo Go) checkout.

## Phase 1: Backend Implementation (TDD) [checkpoint: d8434b5]
- [x] Task: Create unit tests for `PaymentService.createMomoPaymentUrl` to handle dynamic `redirectUrl`. a1d1e1f
- [x] Task: Update `PaymentService.js` to accept and use the optional `redirectUrl`. a1d1e1f
- [x] Task: Create integration tests for `/api/payments/create-momo/:bookingId` endpoint with dynamic `redirectUrl`. 4dea653
- [x] Task: Update `paymentRoutes.js` to extract `redirectUrl` from request body and pass it to the service. 4dea653
- [x] Task: Conductor - User Manual Verification 'Phase 1: Backend Implementation' (Protocol in workflow.md) d8434b5

## Phase 2: Mobile App Integration
- [x] Task: Update `mobile-app/src/services/movieService.ts` to support passing `redirectUrl` in `createMomoPayment`. 23fc1af
- [ ] Task: Update `mobile-app/src/screens/CheckoutScreen.tsx` to generate and pass the Expo Go redirect URL.
- [ ] Task: Configure deep linking in the mobile app to handle the redirect back from MoMo.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Mobile App Integration' (Protocol in workflow.md)

## Phase 3: Verification & Polish
- [ ] Task: Verify end-to-end payment flow on Web (default fallback).
- [ ] Task: Verify end-to-end payment flow on Android Emulator (dynamic redirect).
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Verification & Polish' (Protocol in workflow.md)
