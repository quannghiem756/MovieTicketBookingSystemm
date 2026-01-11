# Specification - Mobile Booking Flow and Auth Refresh

## Overview
This track aims to improve the user experience (UX) of the mobile application (CineBook) by implementing a dedicated booking confirmation screen, ensuring the UI accurately reflects authentication states, and providing proactive data refreshing for key screens.

## User Stories
- As a moviegoer, I want to see a clear confirmation screen after successfully booking a ticket so that I know my purchase was successful and can see the summary.
- As a user, I want the app to immediately show the login screen or update the UI when my session expires or an authentication error occurs, so I'm not confused by stale data.
- As a user, I want my ticket list and seat selection to be up-to-date whenever I view them, especially after logging back in or navigating between screens.

## Functional Requirements
### 1. Booking Confirmation Screen
- Create a new screen `BookingConfirmation.tsx` (or `.jsx`) in the `mobile-app` source.
- Design should mirror the web version (`BookingConfirmation.jsx`).
- It must display:
    - Success message.
    - Movie title, theater, showtime.
    - Selected seats.
    - Total amount paid.
    - A button to go back to the Home or My Bookings screen.
- Update the booking flow in `mobile-app` to navigate to this screen upon successful payment/booking confirmation.

### 2. Immediate Auth Refresh
- Investigate and fix the issue where the UI doesn't immediately reflect a logged-out state or auth error.
- Ensure that if the backend returns a 401 or the `AuthContext` state changes to "logged out", the app's navigation or global UI (headers, tabs) updates immediately.
- If a user is on a protected screen when auth fails, they should be redirected to the Login screen.

### 3. Screen Refresh Logic
- **Ticket List Screen:**
    - Implement "Pull-to-Refresh" functionality.
    - Implement "refresh on focus" logic (e.g., using `useFocusEffect` from React Navigation) to fetch the latest data when the user navigates to the screen.
- **Seat Selection Screen:**
    - Implement "refresh on focus" logic to ensure seat availability is current when opening the screen.
    - Implement "Pull-to-Refresh" if applicable.

## Non-Functional Requirements
- **Performance:** Screen refreshes should be efficient and not cause unnecessary UI flickering.
- **Consistency:** Mobile UI should follow Material Design principles using `react-native-paper`.
- **Localization:** All new strings must be added to the i18n translation files.

## Acceptance Criteria
- [ ] A `BookingConfirmation` screen exists on mobile and is reachable after a successful booking.
- [ ] Successfully booking a ticket redirects the user to the `BookingConfirmation` screen.
- [ ] If the user's token expires, the app immediately redirects to the Login screen or shows the logged-out state in the UI.
- [ ] Navigating to the "My Bookings" screen triggers a data refresh.
- [ ] Pull-to-refresh on the "My Bookings" screen updates the ticket list.
- [ ] Navigating to the "Seat Selection" screen triggers a data refresh of seat availability.

## Out of Scope
- Redesigning the entire booking flow.
- Implementing new payment methods.
- Changes to the backend API (unless strictly necessary for the refresh logic).
