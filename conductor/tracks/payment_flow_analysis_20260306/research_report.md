# Research Report: Payment Flow & Seat Selection Timeout Analysis

## 1. Backend Analysis
### Seat-Hold Lifecycle
- **Initial Hold**: Triggered by `BookingService.holdSeat`. Sets `expiresAt` to **10 minutes** from the current time.
- **Booking Creation**: Triggered by `BookingService.createBooking` (when the user proceeds to checkout). If the payment method is `momo`, the status is set to `pending` and `expiresAt` is extended to **15 minutes** from the current time.
- **Expiration Mechanism**: The system uses "implicit release". Expired bookings are still in the database but are ignored by `findLockedSeats`, `findCollidingBooking`, and `findPendingBookingByUser` in `MongoBookingRepository.js` using `expiresAt: { $gt: new Date() }`.

### Payment Processing Vulnerability
- **Callback Handling**: `PaymentService.processPaymentResult` receives the MoMo callback.
- **The Bug**: It confirms the booking based *only* on the MoMo `resultCode`. It **does not check if the booking has already expired** (`expiresAt`).
- **Risk**: If a user takes longer than 15 minutes to pay, their seats are released and could be booked by someone else. If the payment eventually succeeds, both bookings will be marked as `confirmed`, resulting in a **double-booked seat**.

## 2. Frontend Analysis (Web)
### Timer Display
- `BookingPage.jsx` implements a countdown timer using `timeLeft` state.
- The timer is initialized from the backend's `expiresAt`.
- **Issue**: The timer is only present on the seat selection page. Once the user is redirected to the MoMo payment gateway, the application state is lost, and the user has no visual indicator of the remaining time.

## 3. Mobile App Analysis (CineBook)
### Timer Display
- `SeatSelectionScreen.tsx` shows a countdown timer.
- **Issue 1**: `CheckoutScreen.tsx` (the intermediate step before MoMo redirect) **does not display the timer**.
- **Issue 2**: Similar to the web app, once redirected to the MoMo app via `Linking.openURL`, the user loses the timer visibility.

## 4. Recommendations
- **Backend**: Add a check in `processPaymentResult` to ensure the booking hasn't expired before marking it as `confirmed`. If expired, the payment should be handled (e.g., refund or manual intervention) and the booking remained `cancelled`.
- **Frontend/Mobile**: Ensure the timer persists through the checkout screen. Provide a clear warning before the redirect that the seat hold is only valid for a specific duration.
