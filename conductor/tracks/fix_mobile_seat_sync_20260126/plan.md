# Implementation Plan: Fix Mobile Seat Selection Socket Sync

## Phase 1: Diagnosis & Backend Verification [checkpoint: 93137b0]
In this phase, we will confirm the exact socket event names used by the web frontend and ensure the backend is correctly broadcasting events from all sources.

- [x] Task: Audit Backend Socket Logic 93137b0
    - [x] Identify the specific event names for seat selection in `backend/src/infrastructure/socket/socket.js` (or equivalent).
    - [x] Verify if the backend treats requests from mobile and web differently.
- [x] Task: Write Backend Integration Test 93137b0
    - [x] Create a test that simulates a mobile-like client connecting and emitting a seat selection event.
    - [x] Verify that the event is broadcast to other connected clients.
- [x] Task: Conductor - User Manual Verification 'Phase 1' (Protocol in workflow.md) 93137b0

## Phase 2: Mobile App Implementation [checkpoint: 93137b0]
In this phase, we will implement the socket emission logic in the mobile app and ensure it matches the protocol used by the web app.

- [x] Task: Audit Mobile Seat Selection Component 93137b0
    - [x] Locate the seat selection screen in `mobile-app/src/`.
    - [x] Check how `SocketContext` or the socket instance is currently used (if at all).
- [x] Task: Implement Socket Emission on Mobile 93137b0
    - [x] Add the emission of seat selection/deselection events within the seat tap handler.
    - [x] Ensure the payload matches what the backend expects (e.g., `showtimeId`, `seatNumber`, `userId`).
- [x] Task: Verify Mobile Socket Listeners 93137b0
    - [x] Ensure the mobile app is correctly listening for updates from the server and updating the local seat map state.
- [x] Task: Conductor - User Manual Verification 'Phase 2' (Protocol in workflow.md) 93137b0

## Phase 3: End-to-End Verification [checkpoint: 93137b0]
Final testing to ensure seamless synchronization between web and mobile.

- [x] Task: Manual Cross-Platform Test 93137b0
    - [x] Verify mobile selection -> web update.
    - [x] Verify web selection -> mobile update.
- [x] Task: Conductor - User Manual Verification 'Phase 3' (Protocol in workflow.md) 93137b0