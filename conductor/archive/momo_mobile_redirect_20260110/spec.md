# Track Specification: Dynamic MoMo Redirect for Mobile and Web

## Overview
The current MoMo payment integration uses a fixed `MOMO_REDIRECT_URL` (typically pointing to the web frontend on `localhost`). This fails for the mobile app, especially in emulators, as it cannot redirect back to the app or handle `localhost`. This track will modify the backend to accept a dynamic `redirectUrl` from the client, allowing the mobile app to specify its Expo Go deep link as the return destination.

## Functional Requirements
- **Dynamic Redirect URL**: The backend `create-momo` endpoint must be updated to accept an optional `redirectUrl` from the request body.
- **Mobile Support**: The mobile app will send its Expo Go URL (e.g., `exp://10.0.2.2:8081`) as the `redirectUrl` to ensure MoMo redirects the user back into the app.
- **Deep Link Handling**: The app must be configured to handle the incoming deep link and navigate to the appropriate payment result screen.
- **Fallback Logic**: If no `redirectUrl` is provided by the client, the backend should fall back to the default `MOMO_REDIRECT_URL` (web).

## Technical Details
- **Backend Changes**:
    - Update `backend/src/interfaces/paymentRoutes.js` to extract `redirectUrl` from the request body.
    - Update `backend/src/application/PaymentService.js` to use the provided `redirectUrl` when calling the MoMo API.
- **Mobile Changes**:
    - Update `mobile-app/src/services/movieService.ts` to support passing `redirectUrl` in `createMomoPayment`.
    - Update `mobile-app/src/screens/CheckoutScreen.tsx` to generate and pass the Expo Go redirect URL.
    - Ensure the mobile app is configured to listen for the deep link return.

## Acceptance Criteria
- [ ] Users paying via the Web frontend are redirected back to the Web result page.
- [ ] Users paying via the Mobile App (Expo Go) are redirected back to the Mobile App after payment.
- [ ] The backend correctly handles the absence of a `redirectUrl` by using the default environment variable.
- [ ] Payment status is correctly updated regardless of the redirect source.

## Out of Scope
- Implementing other payment gateways (ZaloPay, etc.).
- Changing the MoMo IPN (callback) logic, unless required for signature verification with dynamic URLs.
