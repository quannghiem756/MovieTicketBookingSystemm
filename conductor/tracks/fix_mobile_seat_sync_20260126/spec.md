# Specification: Fix Mobile Seat Selection Socket Sync

## Overview
This track addresses a bug where seat selections made in the mobile application (CineBook) are not synchronized in real-time with other clients (web and other mobile instances). While web-to-web synchronization is working, mobile-to-web and mobile-to-mobile synchronization for seat "holds" or selections is failing.

## Functional Requirements
- **Mobile Emission:** The mobile app must emit a socket event (e.g., `seat-selected` or `toggle-seat`) to the backend whenever a user taps a seat.
- **Bi-directional Sync:** 
    - Selections made on mobile must be broadcast by the server to all other connected clients (Web & Mobile).
    - Selections made on web must continue to be received and reflected in the mobile seat map.
- **Connection Reliability:** Ensure the mobile socket client correctly identifies with the showtime session so it receives relevant updates.

## Non-Functional Requirements
- **Real-time Performance:** Latency for seat status updates should be minimal to prevent double-booking or seat conflicts.
- **Consistency:** The seat map state on mobile must strictly match the server's record of "held" seats.

## Acceptance Criteria
- [ ] Tapping a seat on the mobile app immediately marks it as "selected" on a concurrent web session for the same showtime.
- [ ] Deselecting a seat on mobile immediately unmarks it on the web session.
- [ ] Selecting a seat on web immediately updates the mobile seat map.
- [ ] The seat-hold timer on mobile remains synchronized with the backend.

## Out of Scope
- Redesigning the seat selection UI.
- Modifying the payment or booking finalization logic (unless directly related to socket data).
