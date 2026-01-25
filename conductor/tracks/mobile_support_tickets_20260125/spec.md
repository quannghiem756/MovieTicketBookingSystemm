# Specification: Support Ticket System for Mobile App

## Overview
Implement the customer support ticket system in the CineBook mobile app to achieve feature parity with the web platform. This includes a "Contact Us" submission form and a dedicated screen for viewing ticket details and replies, accessible via deep links from notification emails.

## Functional Requirements
### 1. "Contact Us" Entry Point
- Add a "Help & Support" section to the **Profile** screen.
- Provide a navigation item labeled "Contact Us" that leads to the submission form.

### 2. "Contact Us" Submission Form (Full Screen)
- **Fields:**
    - Name (Pre-filled if the user is logged in).
    - Email (Pre-filled if the user is logged in).
    - Phone Number.
    - Category Selection (Dropdown: Payment Issue, Ticket/QR Problem, Account, General Question).
    - Message (Multi-line text input).
- **Validation:** Ensure all fields are filled and the email format is valid before submission.
- **Backend Integration:** Use the existing `POST /api/support/tickets` endpoint.
- **Success State:** Display a success message or confirmation screen with instructions to check their email for a tracking link.

### 3. Ticket Details & Reply Screen
- Implement a dedicated screen to view a single support ticket and its conversation history.
- **Display:**
    - Ticket metadata (Subject/Category, Status, Date).
    - Thread of messages (User messages and Staff replies).
    - Form to add a new reply to the ticket.
- **Backend Integration:**
    - Use `GET /api/support/public/:token` to fetch ticket details and comments.
    - Use `POST /api/support/public/:token/reply` to submit new replies.

### 4. Deep Linking Support
- Configure the mobile app to handle deep links in the format: `cinebook://support/ticket/:token`.
- When a user clicks a "View Ticket" link in a notification email, the app should open directly to the Ticket Details screen for that specific token.

## Non-Functional Requirements
- **I18n:** Full bilingual support (English/Vietnamese) for all labels, placeholders, and error messages.
- **UI/UX:** Adhere to Material Design principles using `react-native-paper`. Ensure form fields are accessible and the keyboard doesn't obscure the active input.

## Acceptance Criteria
- [ ] Users can navigate to the "Contact Us" form from their Profile.
- [ ] Submitting the form correctly creates a ticket in the backend and triggers the standard email notification.
- [ ] Clicking a tracking link in an email opens the CineBook app to the correct ticket.
- [ ] Users can see the full conversation history and post replies from within the app.
- [ ] All new UI elements are fully translated in both English and Vietnamese.

## Out of Scope
- An "Admin" view for staff to manage tickets within the mobile app (staff will continue to use the web-based admin panel).
- A list of "My Tickets" in the profile (relying on email links for this phase).
