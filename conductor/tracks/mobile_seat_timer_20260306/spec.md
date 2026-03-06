# Specification: Mobile Seat-Hold Timer Persistence & Warning

## Overview
This track aims to improve the booking experience on the CineBook mobile application by ensuring the seat-hold timer (10 minutes) persists as the user navigates from the seat selection screen to the checkout/payment screen. Additionally, it will provide a clear warning to the user before they are redirected, emphasizing the limited duration of the seat hold.

## Functional Requirements
1.  **Timer Persistence:**
    -   The 10-minute seat-hold timer initiated on the `SeatSelectionScreen` must continue counting down on the `CheckoutScreen` (or equivalent).
    -   Persistence will be handled within the active session using React Context to share the `timeLeft` state between screens.
2.  **Checkout Warning Banner:**
    -   A non-intrusive countdown banner must be displayed at the top of the checkout screen.
    -   The banner should update in real-time.
    -   Text should be bilingual (English/Vietnamese).
3.  **Automatic Redirection on Expiry:**
    -   If the timer reaches zero while the user is on the checkout screen, they must be automatically redirected back to the `SeatSelectionScreen`.
    -   An alert should be shown to inform the user that their hold has expired and seats have been released.
4.  **Pre-Navigation Sync:**
    -   Before navigating from `SeatSelectionScreen` to `CheckoutScreen`, the app should ensure the timer state is correctly synchronized in the global context.

## Non-Functional Requirements
1.  **Real-time Updates:** The timer must decrement every second accurately.
2.  **UI Consistency:** The countdown banner must follow Material Design principles using `react-native-paper`.
3.  **Accessibility:** The countdown should be readable by screen readers.

## Acceptance Criteria
1.  User selects seats and sees a 10-minute countdown.
2.  User proceeds to checkout; the countdown continues from its current value on the new screen.
3.  A banner at the top of the checkout screen shows the remaining time.
4.  If time runs out on the checkout screen, the app redirects to seat selection with an "Expired" alert.
5.  If user goes back to seat selection manually, the timer continues correctly.

## Out of Scope
-   Persistence across app restarts (timer is session-only).
-   Extending the hold time from the checkout screen.