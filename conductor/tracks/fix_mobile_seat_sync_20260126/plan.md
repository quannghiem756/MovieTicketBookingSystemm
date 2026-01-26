# Implementation Plan: Fix Mobile Seat Selection Socket Sync

## Phase 1: Diagnosis & Backend Verification
In this phase, we will confirm the exact socket event names used by the web frontend and ensure the backend is correctly broadcasting events from all sources.

- [x] Task: Audit Backend Socket Logic
    - [x] Identify the specific event names for seat selection in `backend/src/infrastructure/socket/socket.js` (or equivalent).
    - [x] Verify if the backend treats requests from mobile and web differently.
- [x] Task: Write Backend Integration Test
    - [x] Create a test that simulates a mobile-like client connecting and emitting a seat selection event.
    - [x] Verify that the event is broadcast to other connected clients.
- [ ] Task: Conductor - User Manual Verification 'Phase 1' (Protocol in workflow.md)

## Phase 2: Mobile App Implementation
In this phase, we will implement the socket emission logic in the mobile app and ensure it matches the protocol used by the web app.

- [x] Task: Audit Mobile Seat Selection Component
    - [x] Locate the seat selection screen in `mobile-app/src/`.
    - [x] Check how `SocketContext` or the socket instance is currently used (if at all).
- [x] Task: Implement Socket Emission on Mobile
    - [x] Add the emission of seat selection/deselection events within the seat tap handler.
    - [x] Ensure the payload matches what the backend expects (e.g., `showtimeId`, `seatNumber`, `userId`).
- [x] Task: Verify Mobile Socket Listeners
    - [x] Ensure the mobile app is correctly listening for updates from the server and updating the local seat map state.
- [ ] Task: Conductor - User Manual Verification 'Phase 2' (Protocol in workflow.md)

## Phase 3: End-to-End Verification
Final testing to ensure seamless synchronization between web and mobile.

- [x] Task: Manual Cross-Platform Test
    - [x] Verify mobile selection -> web update.
    - [x] Verify web selection -> mobile update.
- [ ] Task: Conductor - User Manual Verification 'Phase 3' (Protocol in workflow.md)
