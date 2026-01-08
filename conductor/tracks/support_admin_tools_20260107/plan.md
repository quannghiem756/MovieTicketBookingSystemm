# Plan: Support Module & Admin Booking Tools

## Phase 1: Database Foundation & Models [checkpoint: 111ecf6]
- [x] Task: Create `SupportTicket` Mongoose Schema and Model
    - [x] Write unit tests for `SupportTicket` model validation
    - [x] Implement `SupportTicket` schema in `backend/src/infrastructure/SupportTicketModel.js`
- [x] Task: Create `AuditLog` Mongoose Schema and Model
    - [x] Write unit tests for `AuditLog` model validation
    - [x] Implement `AuditLog` schema in `backend/src/infrastructure/AuditLogModel.js`
- [x] Task: Conductor - User Manual Verification 'Phase 1: Database Foundation' (Protocol in workflow.md)

## Phase 2: Support Ticket Submission System [checkpoint: 2c8fc55]
- [x] Task: Implement Support Ticket Creation API
    - [x] Write tests for Ticket creation with auto-priority logic (Category -> Priority)
    - [x] Implement `POST /api/support/tickets` endpoint in `SupportService`
- [x] Task: Create "Contact Us" Frontend Component
    - [x] Write unit tests for the Contact Form modal
    - [x] Implement `ContactUsModal` using MUI in `frontend/src/components/`
    - [x] Add "Contact Us" button to `HomePage` to trigger modal
- [x] Task: Conductor - User Manual Verification 'Phase 2: Support Ticket Submission' (Protocol in workflow.md)

## Phase 3: Admin Booking Management (Backend) [checkpoint: 98e9d0c]
- [x] Task: Implement Booking Search API
    - [x] Write tests for searching bookings by email/phone (with indexing check)
    - [x] Implement search logic in `BookingService`
- [x] Task: Implement Manual Redemption API
    - [x] Write tests for manual redemption: check status update and AuditLog creation
    - [x] Implement `PATCH /api/admin/bookings/:id/manual-redeem` in `BookingService`
- [x] Task: Conductor - User Manual Verification 'Phase 3: Admin Booking Management (Backend)' (Protocol in workflow.md)

## Phase 4: Admin Dashboard UI Integration
- [x] Task: Create Support Ticket Management View
    - [x] Write tests for ticket list display (sorting by oldest first)
    - [x] Implement `SupportTicketList` component in Admin Dashboard
- [~] Task: Create Booking Search & Redemption UI
    - [ ] Write tests for search results list and expansion logic
    - [ ] Implement `AdminBookingSearch` component with "Manual Redeem" functionality and Confirmation Modal
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Admin Dashboard UI' (Protocol in workflow.md)
