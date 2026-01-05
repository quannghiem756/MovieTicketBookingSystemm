# Specification: QR Code Ticket Generation & Validation with Staff Role

## 1. Overview
This track implements a secure QR code-based ticket validation system. Users will receive a QR code on their booking confirmation. This QR code contains a signed URL pointing to a validation endpoint. The system will support "Content Negotiation" to serve a JSON response for kiosks/API clients and a visual HTML page for on-site staff using standard mobile browsers. Additionally, a new `staff` user role will be introduced to securely manage ticket validation operations, along with an Admin Dashboard for managing user accounts.

## 2. Functional Requirements

### 2.1 Staff Role Implementation
*   **User Schema:** Update the User model to include `staff` in the `role` enum (currently likely `['user', 'admin']`).
*   **Seed Script:** Create a utility script (`createStaffUser.js`) to generate initial staff accounts.
*   **Auth Middleware:** Update authentication middleware to recognize and authorize the `staff` role.
*   **Permissions:** Ensure `staff` users have access to the ticket validation endpoints but are restricted from critical admin functions (unless specified otherwise).

### 2.2 QR Code Generation
*   **Token Generation:** specific `validationToken` (JWT) containing the `bookingId` and a short-lived expiration or unique signature.
*   **URL Construction:** Generate a full URL: `https://<domain>/api/bookings/validate?token=<signed_token>`.
*   **QR Rendering:** Render this URL as a QR code image on the frontend "Booking Success" page and "My Tickets" section.

### 2.3 Ticket Validation Endpoint (`GET /api/bookings/validate`)
*   **Security:** Endpoint must be protected.
    *   *Browser Flow:* Requires an active session (cookie) from a logged-in `staff` or `admin` user.
    *   *API/Kiosk Flow:* Requires an API Key or Bearer Token authenticating the kiosk/client.
*   **Content Negotiation:**
    *   **If `Accept: application/json`:** Return JSON data `{ status: 'valid'|'invalid'|'redeemed', booking: {...}, seats: [...] }`.
    *   **If `Accept: text/html`:** Return a server-side rendered HTML page (or redirect to a dedicated frontend route) displaying a large Green (Valid) or Red (Invalid/Redeemed) status.
*   **Redemption Logic:**
    *   First scan: Mark booking status as `redeemed` (or `checked_in`).
    *   Subsequent scans: Return `redeemed` (Red/Error) status to prevent reuse.

### 2.4 Admin User Management
*   **User List:** Admin dashboard page to list all users, with filtering by role (`admin`, `staff`, `user`).
*   **Create/Edit User:** Ability for Admins to create new `staff` or `admin` accounts and update existing users (e.g., change roles).
*   **API Endpoints:**
    *   `POST /api/users`: Create a new user (Admin only).
    *   `PUT /api/users/:id`: Update user details/role (Admin only).
    *   `GET /api/users`: List users with pagination and filtering (Admin only).

## 3. Non-Functional Requirements
*   **Security:** Tokens must be cryptographically signed to prevent tampering.
*   **Performance:** Validation checks must be fast (<200ms) to ensure smooth queues at the cinema.
*   **Usability:** The HTML validation page must be mobile-responsive and high-contrast for easy reading by staff in low-light cinema environments.

## 4. Documentation
*   **Workflow:** Create `docs/ticket-validation-workflow.md` diagramming the generation, scanning, and validation flows.

## 5. Out of Scope
*   Physical Kiosk hardware integration (we are just building the API/Software layer).