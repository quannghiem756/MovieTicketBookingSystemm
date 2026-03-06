# Implementation Plan: Payment Flow & Seat Selection Timeout Optimization

## Phase 1: Research & Discovery
Investigate the current implementation of seat holding and how it interacts with the payment process.

- [x] Task: Backend - Trace seat-hold lifecycle (Mongoose models/Socket.io events) 3488cfa
    - [x] Identify where the 10-minute timer is started.
    - [x] Verify the mechanism for releasing seats (e.g., `setTimeout` or cron).
- [x] Task: Frontend - Analyze timer display and payment redirect 3488cfa
    - [x] Locate the timer component in the React app.
    - [x] Trace the redirection logic to MoMo.
- [x] Task: MoMo Integration - Verify callback handling 3488cfa
    - [x] Trace the backend webhook for MoMo payments.
    - [x] Confirm how the system handles delayed payment confirmations.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Research & Discovery' (Protocol in workflow.md)

## Phase 2: Backend Implementation (Grace Period)
Add logic to extend seat holds when a payment is initiated.

- [ ] Task: Backend - Implement `extendSeatHold` functionality
    - [ ] Create a service method to add a 5-minute "Grace Period" to an existing hold.
    - [ ] Update the `booking` creation logic to trigger this extension.
- [ ] Task: Backend - Robustness check for expired bookings
    - [ ] Ensure that even if a payment is confirmed by MoMo, the booking is rejected if the seat-hold had already expired *before* the payment was started.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Backend Implementation' (Protocol in workflow.md)

## Phase 3: Frontend & UI Improvements
Ensure the user is informed about the time limit throughout the checkout process.

- [ ] Task: Frontend - Persistent Timer on Payment Screen
    - [ ] Ensure the countdown timer remains visible after the user moves to the payment step.
    - [ ] Add a notification when the "Grace Period" is added.
- [ ] Task: Frontend - Handle Expiration Scenarios
    - [ ] Implement a modal/alert for when the seat-hold expires while the user is still on the site.
    - [ ] Gracefully handle the return from MoMo if the session has timed out.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Frontend & UI Improvements' (Protocol in workflow.md)

## Phase 4: Final Validation
Comprehensive testing of the entire flow.

- [ ] Task: E2E - Test full booking flow within the time limit
- [ ] Task: E2E - Test booking rejection on timeout
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Final Validation' (Protocol in workflow.md)