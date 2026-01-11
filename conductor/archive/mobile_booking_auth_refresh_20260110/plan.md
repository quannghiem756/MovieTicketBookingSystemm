# Plan - Mobile Booking Flow and Auth Refresh

This plan outlines the steps to implement a booking confirmation screen, improve authentication state reactivity, and add data refreshing logic to the mobile app.

## Phase 1: Foundation & Booking Confirmation [checkpoint: d152996]
This phase focuses on creating the new screen and integrating it into the booking flow.

- [x] Task: Create `BookingConfirmation` screen component in `mobile-app/src/screens/`. d152996
- [x] Task: Register `BookingConfirmation` in the navigation stack (`mobile-app/src/navigation/`). d3a192f
- [x] Task: Update the post-booking logic (likely in `PaymentScreen` or `BookingService`) to navigate to `BookingConfirmation` with the booking details. d3a192f
- [x] Task: Add necessary strings to i18n translation files (`mobile-app/src/translations/`). d152996
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Foundation & Booking Confirmation' (Protocol in workflow.md)

## Phase 2: Auth State Reactivity [checkpoint: 5ad2486]
This phase ensures the app responds immediately to authentication changes.

- [x] Task: Review `AuthContext` and Axios interceptors in `mobile-app` to ensure 401 errors trigger a logout state. 5ad2486
- [x] Task: Ensure navigation state is tied to `AuthContext` so that switching to `isAuthenticated: false` immediately renders the Login stack or redirects. 5ad2486
- [x] Task: Verify that UI components (like headers or profile tabs) listen to `AuthContext` changes for immediate updates. 5ad2486
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Auth State Reactivity' (Protocol in workflow.md)

## Phase 3: Data Refreshing Logic [checkpoint: d97ffb8]
This phase adds the proactive refresh logic to the specified screens.

- [x] Task: Implement `useFocusEffect` or `useIsFocused` in the Ticket List (My Bookings) screen to trigger a re-fetch of tickets. d97ffb8
- [x] Task: Add `RefreshControl` to the `ScrollView` or `FlatList` in the Ticket List screen for pull-to-refresh. d97ffb8
- [x] Task: Implement `useFocusEffect` in the Seat Selection screen to re-fetch seat availability. d97ffb8
- [x] Task: Verify refresh logic works correctly when switching between tabs or returning from the booking flow. d97ffb8
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Data Refreshing Logic' (Protocol in workflow.md)

## Phase 4: Final Polishing & Verification
- [x] Task: Final pass on UI styling to ensure Material Design consistency. d97ffb8
- [x] Task: Run full regression on the mobile booking flow. d97ffb8
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Final Polishing & Verification' (Protocol in workflow.md)