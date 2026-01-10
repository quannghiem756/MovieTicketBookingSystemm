# Specification: Mobile Seat Selection and Checkout Fixes

## Overview
This track addresses several critical issues in the mobile application:
1.  **Seat Selection Screen:** Broken layout (overlapping seats) and non-responsive seat selection interactions.
2.  **Concurrency & Seathold:** Missing realtime socket mechanics for seat holding and the seathold timer cooldown (parity with the web application).
3.  **Checkout Screen:** A `TransformError` caused by a duplicate `IconButton` declaration.

## Functional Requirements
### 1. Seat Selection UI/UX Fixes
- Correct the layout logic in `SeatSelectionScreen` to prevent seat overlapping.
- Ensure seat icons respond to touch and update their visual state (Selected/Available/Reserved) immediately.

### 2. Realtime Seathold & Socket Integration
- Verify and/or implement the Socket.io client connection within the mobile app.
- Implement a "Seathold Timer" cooldown UI that appears when seats are selected, matching the web app's behavior.
- Ensure seats are locked/unlocked in realtime across all clients using socket events.

### 3. Checkout Screen Repair
- Fix the `Duplicate declaration "IconButton"` error in `src/screens/CheckoutScreen.tsx`.
- Perform a general cleanup of imports and syntax in `CheckoutScreen.tsx` to prevent further transform errors.

## Acceptance Criteria
- Seats in the mobile app can be selected/deselected without layout glitches.
- A countdown timer is visible upon selecting a seat, and the seat is released when the timer expires.
- The mobile app correctly receives realtime updates when seats are held by other users.
- The Checkout screen loads successfully without any "Duplicate declaration" or syntax errors.

## Out of Scope
- Complete redesign of the Seat Selection or Checkout screens.
- Backend socket logic changes (unless existing events are found to be insufficient for mobile).
