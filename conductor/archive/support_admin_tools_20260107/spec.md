# Specification: Support Module & Admin Booking Tools

## 1. Overview
This feature introduces a customer support module allowing users to submit inquiries and provides admins with tools to manage these support tickets and manually intervene in booking redemptions. The goal is to streamline communication and provide a fallback for QR code scanning issues.

## 2. Functional Requirements

### 2.1 User Interface (Frontend)
*   **Contact Us Access:**
    *   Add a "Contact Us" button to the **Home Page**.
    *   Clicking the button opens a **Modal/Popup** containing the support form.
*   **Support Form:**
    *   **Fields:**
        *   Name (Required)
        *   Email (Required)
        *   Phone (Required)
        *   Category (Dropdown: "Payment Issue", "Ticket/QR Problem", "Account", "General Question")
        *   Message (Textarea, Required)
    *   **Behavior:**
        *   If the user is logged in, auto-fill Name/Email/Phone/UserId if available.
        *   On submission, display a success message and close the modal.

### 2.2 Admin Dashboard (Frontend)
*   **Support Ticket Management:**
    *   Display a list of tickets from the `SupportTickets` table.
    *   **Sorting:** Oldest tickets (by `created_at`) appear first.
    *   **Display:** Show Status, Priority, Category, and User details.
*   **Booking Search & Redemption:**
    *   **Search Input:** Allow searching bookings by User **Email** or **Phone Number**.
    *   **Results List:**
        *   Sort by Date (Newest first).
        *   **Row Content:** Booking ID, Movie Title, Showtime, Status.
        *   **Expansion:** The most recent booking is automatically expanded to show seat details. Others expand on click.
        *   **Action:** Add a "Manual Redeem" button to each row.
            *   **Visibility:** Visible/Enabled only if status is `Paid`. Hidden/Disabled if `Redeemed` or `Cancelled`.
            *   **Interaction:** Clicking triggers a **Confirmation Modal**: "Are you sure? Please ensure you have verified the customer's ID or identity."
            *   **Confirm:** Calls backend to update status and log the action.

### 2.3 Backend & Database
*   **Schema: `SupportTickets`**
    *   `_id` (ObjectId)
    *   `userId` (ObjectId, Optional/Nullable)
    *   `name` (String)
    *   `email` (String)
    *   `phone` (String)
    *   `category` (String)
    *   `message` (String)
    *   `priority` (String: "High", "Medium", "Low")
    *   `status` (String, Default: "Open")
    *   `created_at` (Timestamp)
*   **Schema: `AuditLogs`**
    *   `_id` (ObjectId)
    *   `staffId` (ObjectId)
    *   `bookingId` (ObjectId)
    *   `action` (String, e.g., "MANUAL_REDEEM")
    *   `timestamp` (Timestamp)
*   **Logic:**
    *   **Priority Assignment (on Ticket Creation):**
        *   "Payment Issue" OR "Ticket/QR Problem" -> **High**
        *   "Account" -> **Medium**
        *   All others -> **Low**
    *   **Manual Redeem:**
        *   Verify Booking is `Paid`.
        *   Update Booking status to `Redeemed`.
        *   Create entry in `AuditLogs`.

## 3. Non-Functional Requirements
*   **Security:** Admin endpoints (Ticket list, Search, Redeem) must be protected by Role-Based Access Control (RBAC).
*   **Performance:** Index `email` and `phone` fields on the `Bookings` table for fast search.

## 4. Acceptance Criteria
*   [ ] A guest user can submit a ticket; it receives the correct priority based on category.
*   [ ] Admin sees tickets sorted by oldest first.
*   [ ] Admin can search bookings by phone; results show up correctly.
*   [ ] Clicking "Manual Redeem" shows confirmation; confirming updates status to 'Redeemed'.
*   [ ] A "MANUAL_REDEEM" record is found in the `AuditLogs` after the action.
