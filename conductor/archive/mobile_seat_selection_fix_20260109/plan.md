# Plan: Mobile Seat Selection and Checkout Fixes

## Phase 1: [checkpoint: f55f4a2] Diagnostics and Checkout Screen Fix
- [x] Task: Fix duplicate `IconButton` declaration in `src/screens/CheckoutScreen.tsx` (already handled). f55f4a2
- [x] Task: Inspect `src/screens/SeatSelectionScreen.tsx` (or equivalent) to diagnose layout overlapping and touch responsiveness issues. f55f4a2
- [x] Task: Verify existing Socket.io implementation status in the mobile app. f55f4a2
- [x] Task: Conductor - User Manual Verification 'Phase 1' (Protocol in workflow.md) f55f4a2

## Phase 2: [checkpoint: f55f4a2] Seat Selection UI & Layout Repair
- [x] Task: Refactor seat layout logic to fix overlapping (likely adjusting container widths or seat scaling). f55f4a2
- [x] Task: Fix touch handlers to ensure visual state updates on seat selection. f55f4a2
- [x] Task: Implement unit tests for seat selection state logic if feasible. f55f4a2
- [x] Task: Conductor - User Manual Verification 'Phase 2' (Protocol in workflow.md) f55f4a2

## Phase 3: [checkpoint: f55f4a2] Realtime Socket & Seathold Timer
- [x] Task: Integrate/Verify Socket.io listeners for `seatHeld` and `seatReleased` events. f55f4a2
- [x] Task: Implement the Seathold Timer component (cooldown) in the mobile app. f55f4a2
- [x] Task: Sync timer expiration with backend/socket events to release seats. f55f4a2
- [x] Task: Conductor - User Manual Verification 'Phase 3' (Protocol in workflow.md) f55f4a2

## Phase 4: [checkpoint: f55f4a2] Verification
- [x] Task: End-to-end test: Select seat on mobile, verify "held" status on web. f55f4a2
- [x] Task: End-to-end test: Wait for mobile timer to expire, verify seat release. f55f4a2
- [x] Task: Verify Checkout screen navigation and rendering. f55f4a2
- [x] Task: Conductor - User Manual Verification 'Phase 4' (Protocol in workflow.md) f55f4a2
