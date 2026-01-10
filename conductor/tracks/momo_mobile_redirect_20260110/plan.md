# Track Plan: Dynamic MoMo Redirect for Mobile and Web

This track implements dynamic redirect URLs for MoMo payments to support mobile app (Expo Go) checkout.

## Phase 1: Backend Implementation (TDD) [checkpoint: d8434b5]
- [x] Task: Create unit tests for `PaymentService.createMomoPaymentUrl` to handle dynamic `redirectUrl`. a1d1e1f
- [x] Task: Update `PaymentService.js` to accept and use the optional `redirectUrl`. a1d1e1f
- [x] Task: Create integration tests for `/api/payments/create-momo/:bookingId` endpoint with dynamic `redirectUrl`. 4dea653
- [x] Task: Update `paymentRoutes.js` to extract `redirectUrl` from request body and pass it to the service. 4dea653
- [x] Task: Conductor - User Manual Verification 'Phase 1: Backend Implementation' (Protocol in workflow.md) d8434b5

## Phase 2: Mobile App Integration [checkpoint: d8434b5]
- [x] Task: Update `mobile-app/src/services/movieService.ts` to support passing `redirectUrl` in `createMomoPayment`. 23fc1af
- [x] Task: Update `mobile-app/src/screens/CheckoutScreen.tsx` to generate and pass the Expo Go redirect URL. 599c3ce
- [x] Task: Configure deep linking in the mobile app to handle the redirect back from MoMo. 94c12af
- [x] Task: Conductor - User Manual Verification 'Phase 2: Mobile App Integration' (Protocol in workflow.md)

## Phase 3: Backend Refactor (Intermediary Redirect) [checkpoint: 187bfd2]
- [x] Task: Update `PaymentService.js` to append `redirectUrl` as a query param to the backend return URL instead of replacing it. f9feda9
- [x] Task: Update `paymentRoutes.js` `/momo/return` to detect and use the `redirectUrl` query param for the final redirect. 96c9bb0
- [x] Task: Update tests to verify the intermediary redirect logic. ec78bb7
- [x] Task: Update `PaymentService.js` to accept a dynamic `baseReturnUrl` argument. 561d915
- [x] Task: Update `paymentRoutes.js` to construct `baseReturnUrl` from request headers and pass it to the service. e3f01e9
- [x] Task: Conductor - User Manual Verification 'Phase 3: Backend Refactor' (Protocol in workflow.md) 187bfd2

## Phase 4: Verification & Polish
- [x] Task: Verify end-to-end payment flow on Web (default fallback). feb29e5
- [x] Task: Verify end-to-end payment flow on Android Emulator (dynamic redirect). feb29e5
- [~] Task: Conductor - User Manual Verification 'Phase 4: Verification & Polish' (Protocol in workflow.md)
