# Plan: QR Code Ticket Generation & Validation

## Phase 1: Staff Role & Authentication Backend [checkpoint: b014281]
This phase focuses on updating the backend to support the new `staff` role and establishing the foundation for secure validation.

- [x] Task: Update `User` model to include `staff` in the `role` enum. 1e176ea
- [x] Task: Create `createStaffUser.js` seed script to generate initial staff accounts. d068884
- [x] Task: Update `authMiddleware` to support `staff` role authorization. bd4c48d
- [x] Task: Create backend tests for role-based access control (RBAC) to ensure `staff` has correct permissions. bd4c48d
- [x] Task: Conductor - User Manual Verification 'Phase 1: Staff Role & Authentication Backend' (Protocol in workflow.md) b014281

## Phase 2: Token Generation & QR Code Logic [checkpoint: 57b0939]
This phase implements the logic for creating secure signed tokens and generating the QR code content.

- [x] Task: Implement `generateValidationToken` utility using JWT with signing (using `jsonwebtoken`). e124fc5
- [x] Task: Update `BookingService` (or `TicketService`) to generate and store/append the validation token/URL upon booking completion. 71edfb7
- [x] Task: Create unit tests for token generation and verification logic. e124fc5
- [x] Task: Update Frontend `BookingSuccess` and `TicketDetail` components to render the QR Code using a library (e.g., `qrcode.react`) pointing to the validation URL. bf00d4f
- [x] Task: Conductor - User Manual Verification 'Phase 2: Token Generation & QR Code Logic' (Protocol in workflow.md)

## Phase 3: Validation Endpoint & Content Negotiation
This phase builds the core validation endpoint that handles both JSON (API) and HTML (Browser) responses.

- [x] Task: Implement `GET /api/bookings/validate` endpoint. f5c1586
- [x] Task: Implement logic to decode token, verify signature, and check booking status. a650eac
- [x] Task: Implement Content Negotiation: return JSON for `application/json` and render HTML for `text/html`. 216f3ae
- [x] Task: Implement "Redemption" logic: Update booking status to `redeemed` on first valid scan. 68848ef
- [x] Task: Create integration tests for the endpoint covering valid, invalid, expired tokens, and double-redemption scenarios. ea07a17
- [x] Task: Conductor - User Manual Verification 'Phase 3: Validation Endpoint & Content Negotiation' (Protocol in workflow.md)

## Phase 4: Admin User Management
This phase implements the management interface for Admins to handle staff and other admin accounts.

- [x] Task: Implement Backend API: `GET /api/users` (list), `POST /api/users` (create), `PUT /api/users/:id` (update). 733c298
- [x] Task: Implement Backend Tests: Verify Admin-only access and correct CRUD operations for users. 733c298
- [x] Task: Create Frontend Admin Page: `UserManagement` table/list view. cfbd35d
- [x] Task: Create Frontend Component: `UserFormModal` for creating/editing users (assigning roles). 72e872a
- [x] Task: Integrate Frontend with Backend User APIs. 4fd18fc
- [~] Task: Conductor - User Manual Verification 'Phase 4: Admin User Management' (Protocol in workflow.md)

## Phase 5: Documentation
- [ ] Task: Create `docs/ticket-validation-workflow.md` diagramming the generation, scanning, and validation flows.
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Documentation' (Protocol in workflow.md)