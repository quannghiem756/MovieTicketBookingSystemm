# Plan: Support Ticket System Overhaul

This plan outlines the implementation of a database-backed support ticket comment system, fixing the admin dashboard interactivity, and creating a public ticket detail page for users.

## Phase 1: Database & Backend Foundation [checkpoint: a5d6d52]
- [x] Task: Create `TicketComment` Mongoose schema and model. <!-- id: acc2fa8 -->
- [x] Task: Update `SupportTicket` schema with `status` and `accessToken` fields. <!-- id: 17ab53a -->
- [x] Task: Implement `SupportTicket` pre-save hook to generate unique `accessToken`. <!-- id: bbbafb9 -->
- [x] Task: Implement `GET /api/support/public/:token` to fetch ticket details and comments. <!-- id: 5efdffd -->
- [x] Task: Implement `POST /api/support/public/:token/reply` for user replies. <!-- id: 12d8295 -->
- [x] Task: Implement `POST /api/support/:id/reply` for Admin/Staff replies (Protected). <!-- id: fb3d558 -->
- [x] Task: Conductor - User Manual Verification 'Phase 1: Database & Backend Foundation' (Protocol in workflow.md) a5d6d52

## Phase 2: Email Notification System [checkpoint: f0ab566]
- [x] Task: Create email template for "New Support Reply". e77fbd2
- [x] Task: Update `Nodemailer` service to include the new template and logic. e77fbd2
- [x] Task: Integrate email trigger into the Admin/Staff reply endpoint. e77fbd2
- [x] Task: Conductor - User Manual Verification 'Phase 2: Email Notification System' (Protocol in workflow.md) f0ab566

## Phase 3: Admin Dashboard Fixes
- [x] Task: Update the Admin Support Ticket list component to make rows clickable or add "View/Reply" buttons. 0281fb1
- [x] Task: Create the `ReplyModal` component to show conversation history and the reply form. 0281fb1
- [x] Task: Integrate `ReplyModal` with the list and backend endpoints. 0281fb1
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Admin Dashboard Fixes' (Protocol in workflow.md)

## Phase 4: Public Ticket Detail Page
- [ ] Task: Create the `PublicTicketDetail` page component in the frontend.
- [ ] Task: Implement the conversation thread view with sender role differentiation.
- [ ] Task: Implement the reply form and submission logic.
- [ ] Add routing for `/support/ticket/:token`.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Public Ticket Detail Page' (Protocol in workflow.md)
