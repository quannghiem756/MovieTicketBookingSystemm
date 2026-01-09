# Plan: Mobile Seat Selection and Checkout Fixes

## Phase 1: Diagnostics and Checkout Screen Fix
- [x] Task: Fix duplicate `IconButton` declaration in `src/screens/CheckoutScreen.tsx` (already handled).
- [x] Task: Inspect `src/screens/SeatSelectionScreen.tsx` (or equivalent) to diagnose layout overlapping and touch responsiveness issues.
- [x] Task: Verify existing Socket.io implementation status in the mobile app.
- [ ] Task: Conductor - User Manual Verification 'Phase 1' (Protocol in workflow.md)

## Phase 2: Seat Selection UI & Layout Repair
- [x] Task: Refactor seat layout logic to fix overlapping (likely adjusting container widths or seat scaling).
- [x] Task: Fix touch handlers to ensure visual state updates on seat selection.
- [ ] Task: Implement unit tests for seat selection state logic if feasible.
- [ ] Task: Conductor - User Manual Verification 'Phase 2' (Protocol in workflow.md)

## Phase 3: Realtime Socket & Seathold Timer
- [x] Task: Integrate/Verify Socket.io listeners for `seatHeld` and `seatReleased` events.
- [x] Task: Implement the Seathold Timer component (cooldown) in the mobile app.
- [x] Task: Sync timer expiration with backend/socket events to release seats.
- [ ] Task: Conductor - User Manual Verification 'Phase 3' (Protocol in workflow.md)

## Phase 4: Verification
- [ ] Task: End-to-end test: Select seat on mobile, verify "held" status on web.
- [ ] Task: End-to-end test: Wait for mobile timer to expire, verify seat release.
- [ ] Task: Verify Checkout screen navigation and rendering.
- [ ] Task: Conductor - User Manual Verification 'Phase 4' (Protocol in workflow.md)
