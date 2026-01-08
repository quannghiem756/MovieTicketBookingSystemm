# Specification: Support Ticket System Overhaul

## Overview
This track addresses non-interactable support ticket lists in the Admin/Staff dashboard and implements a complete internal workflow for handling support correspondence. It replaces the need for Gmail API integration by introducing a database-backed comment system, a public ticket detail page for users, and email notifications containing access links.

## Functional Requirements

### 1. Database & Schema
- **New Schema `TicketComment`:** Create a Mongoose schema to store messages.
  - Fields: `ticketId` (Ref to SupportTicket), `senderId` (Ref to User, nullable for public view if needed or handle via role), `senderRole` (User/Staff/Admin), `content`, `createdAt`.
- **Update `SupportTicket` Schema:** Ensure it tracks status (e.g., 'Open', 'Replied', 'Resolved').
- **Security Token:** Add a secure, unique field (e.g., `access_token` or use a signed ID) to `SupportTicket` to allow public access to the specific ticket page without login.

### 2. Admin & Staff Dashboard (Fixes & Enhancements)
- **Interactive List:** Fix the Support Ticket list to be clickable or have explicit action buttons.
- **Reply Modal:**
  - Clicking a ticket opens a detailed Modal.
  - **View:** Display the entire conversation history (chronological order).
  - **Action:** Provide a text area to send a reply.
  - **Logic:** Sending a reply saves it to `TicketComments`, updates ticket status, and triggers an email notification.

### 3. Public User Interface (New)
- **Ticket Detail Page:** Create a new route (e.g., `/support/ticket/:token`).
  - **Access:** Publicly accessible (no login required) via the unique token.
  - **View:** Display ticket subject, status, and conversation history.
  - **Action:** Allow the user to post a reply.
  - **Logic:** Posting a reply saves to `TicketComments` and optionally notifies Admin/Staff (internal notification).

### 4. Backend Services & Email
- **Email Notification:**
  - Update `Nodemailer` service to send an email to the user when an Admin/Staff replies.
  - **Content:** "New reply to your ticket... Click here to view: [Link]"
- **API Endpoints:**
  - `POST /api/support/:id/reply` (Protected: Admin/Staff)
  - `POST /api/support/public/:token/reply` (Public: User)
  - `GET /api/support/public/:token` (Public: Fetch details + comments)

## Non-Functional Requirements
- **Security:** Ensure the public link token is sufficiently random/secure to prevent ID enumeration.
- **UX:** The reply modal and public page should clearly distinguish between Staff and User messages.

## Out of Scope
- Gmail API integration.
- Real-time chat (WebSocket) for this specific feature (standard HTTP is sufficient).
