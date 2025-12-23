# Seat Reservation & Real-Time Synchronization Workflow

This document outlines the implementation of the advanced seat reservation system, including temporary locking, real-time updates via WebSockets, and security measures to prevent system abuse.

---

## 1. The "Pending" State Strategy

Instead of a simple "Available" or "Booked" binary state, the system now implements a **Temporary Hold** mechanism.

### The Workflow
1.  **Selection:** When a user clicks an available seat, the system immediately creates/updates a booking with the status `held`.
2.  **Expiration:** Each hold is assigned an `expiresAt` timestamp (default: 10 minutes). 
3.  **Database Integration:** The system filters out expired holds during availability checks. A seat is only "Available" if it has no confirmed bookings AND no active (non-expired) holds.

---

## 2. Technical Implementation Approaches

### Database Level (MongoDB)
- **Schema Update:** Added `expiresAt` (Date) and `status: 'held'` to the `BookingModel`.
- **Atomic Operations:** 
    - Used `$addToSet` to add seats to a hold to prevent race conditions within a single user session.
    - Used query filters to ensure a seat cannot be held if another active hold or confirmed booking exists.

### Real-Time Updates (Socket.io)
To provide a seamless experience where users see seats being taken by others instantly:
- **Rooms:** Each showtime has its own WebSocket room (`showtimeId`).
- **Events:**
    - `seat_held`: Broadcast when a user selects a seat.
    - `seat_released`: Broadcast when a user deselects a seat or their session expires.
    - `seat_confirmed`: Broadcast when a payment is successful, locking the seat permanently.

---

## 3. Frontend Experience

### Timer & Urgency
- **Countdown:** A visual timer appears as soon as the first seat is selected.
- **Session Sync:** The timer is synchronized with the backend `expiresAt` value.
- **Auto-Release:** If the timer hits zero, the frontend clears the selection and notifies the user that their session has expired.

### Optimistic UI
- Seats turn green immediately on click while the API request is processed. If the server rejects the lock (e.g., someone else beat them by milliseconds), the seat reverts to "unavailable" and an error message is shown.

---

## 4. Security & Anti-Abuse Measures

To prevent users or bots from "blacking out" a theater without paying, several defensive layers were added:

### Rate Limiting
- **Implementation:** `express-rate-limit` middleware.
- **Constraint:** Maximum of **20 seat-hold requests per minute** per IP address.
- **Goal:** Blocks automated scripts from spamming the reservation system.

### Maximum Seat Restriction
- **Constraint:** A single user is restricted to a maximum of **8 pending seats** at any given time for a specific showtime.
- **Backend Enforcement:** The `BookingService` validates the count before allowing a new seat to be added to the hold.

### Authentication Requirement
- Only logged-in users can initiate a seat hold. This attaches every reservation to a traceable `userId`, making it easier to identify and ban malicious accounts.

---

## 5. API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/bookings/hold` | Locks a single seat for the current user. |
| `POST` | `/api/bookings/release` | Releases a locked seat. |
| `GET` | `/api/bookings/locked-seats/:showtimeId` | Retrieves all currently unavailable seats (Confirmed + Active Holds). |

---

## 6. Translation Keys Added

- `booking.maxSeatsSelected`: Notify user of the 8-seat limit.
- `booking.sessionExpired`: Notify user when the 10-minute hold ends.
- `booking.timeLeft`: Label for the countdown timer.
- `login.subtitle`: UI enhancement for the login portal.
