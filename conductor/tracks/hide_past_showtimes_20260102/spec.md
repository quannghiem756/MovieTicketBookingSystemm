# Specification: Hide Past Showtimes for Customers

## Overview
To improve the user experience and prevent invalid booking attempts, showtimes that have already started or are about to start must be hidden or restricted for customers. Administrators must retain full visibility in their dashboard for management purposes.

## Functional Requirements

### 1. Showtime Visibility Logic (Customers)
*   **Active Booking Window:** If the current time is more than 15 minutes before the showtime's `startTime`, the showtime is visible and booking is enabled.
*   **Booking Closed Window:** If the current time is between 15 minutes before `startTime` and the actual `startTime`, the showtime remains visible, but the "Book" button is replaced with "Booking Closed" text.
*   **Hidden State:** If the current time is equal to or greater than the showtime's `startTime`, the showtime is completely hidden from all customer-facing views.

### 2. Scope of Hiding
*   The visibility logic must be applied to the following customer-facing components:
    *   Movie detail/showtime selection page.
    *   Search results listing showtimes.
    *   Any homepage or sidebar widgets listing upcoming showtimes.

### 3. Administrator Visibility
*   The logic above **must not** apply to the Administrator Dashboard or management views.
*   Administrators must be able to see all showtimes (past and future) to manage bookings, check history, or update records.

## Non-Functional Requirements
*   **Time Accuracy:** Visibility logic must use the system's current time (ideally handled on the backend to prevent client-side clock manipulation).
*   **Performance:** Filtering showtimes should be performant and not noticeably delay page loads or search results.

## Acceptance Criteria
*   [ ] Customers cannot see showtimes that have already started.
*   [ ] Customers see "Booking Closed" instead of a "Book" button 14 minutes before a showtime starts.
*   [ ] Administrators can still see past showtimes in the Admin Dashboard.
*   [ ] The logic is consistent across the showtime page and search results.

## Out of Scope
*   Automated deletion of past showtimes from the database.
*   Changes to the ticket validation/QR scanning logic (handled by a separate service).
