# Implementation Plan - React Native Mobile App (Customer Phase)

This plan outlines the step-by-step development of the mobile application, following a TDD approach and utilizing the existing backend and vector service.

## Phase 1: Project Scaffolding & Backend Authentication Upgrade [checkpoint: b9ea09d]
Goal: Initialize the mobile environment and enable the backend to support mobile token-based authentication.

- [x] Task: Initialize Expo project with TypeScript and MUI-inspired styling. 7275cc8
- [x] Task: Configure Axios with interceptors for Bearer Token handling. 93685fe
- [x] Task: Update Backend AuthService and middleware to support both HttpOnly Cookies (Web) and Bearer Tokens (Mobile). f7f603b
    - [x] Write tests for hybrid authentication logic. f7f603b
    - [x] Implement token extraction from Authorization header. f7f603b
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Project Scaffolding & Backend Authentication Upgrade' (Protocol in workflow.md)

## Phase 2: Navigation & Core Layout [checkpoint: f348136]
Goal: Establish the primary navigation structure and brand-consistent styling.

- [x] Task: Implement Bottom Tab Navigation (Home, Movies, My Tickets, Profile). fc311b7
- [x] Task: Create a shared theme/styles object mirroring the web app's MUI configuration. b88a64d
- [x] Task: Implement reusable UI components (Buttons, Inputs, Cards). add2f20
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Navigation & Core Layout' (Protocol in workflow.md)

## Phase 3: Authentication & User Profile
Goal: Enable users to sign in and manage their identity on mobile.

- [x] Task: Implement Login and Registration screens. 749cd58
    - [x] Write unit tests for auth forms and validation. 749cd58
    - [x] Implement email/password login. 749cd58
- [x] Task: Integrate Google OAuth for mobile using Expo AuthSession. d9bcf61
- [x] Task: Implement Secure Token storage using expo-secure-store. d9bcf61
- [x] Task: Build the Profile screen and booking history list. 2933df5
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Authentication & User Profile' (Protocol in workflow.md)

## Phase 4: Movie Discovery & Catalog
Goal: Deliver the core browsing experience for movies.

- [ ] Task: Implement Home screen with "Now Showing" carousel and News section.
- [ ] Task: Build Movie Discovery screen with search and format filtering (2D/3D/IMAX).
    - [ ] Write tests for filtering logic.
    - [ ] Implement "Zero Results" banner with Chatbot call-to-action.
- [ ] Task: Create Movie Detail screen with video trailer integration and rich metadata.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Movie Discovery & Catalog' (Protocol in workflow.md)

## Phase 5: Booking Workflow & Payments
Goal: Replicate the complex seat selection and payment flow for mobile.

- [ ] Task: Develop an interactive, touch-optimized Seat Selection map.
    - [ ] Write tests for seat selection state management.
    - [ ] Integrate Socket.io for real-time seat availability.
- [ ] Task: Implement Checkout screen with Coupon application functionality.
- [ ] Task: Integrate MoMo E-Wallet payment flow for mobile.
- [ ] Task: Implement "My Tickets" screen with QR code generation for valid bookings.
- [ ] Task: Conductor - User Manual Verification 'Phase 5: Booking Workflow & Payments' (Protocol in workflow.md)

## Phase 6: AI Chatbot Integration
Goal: Provide personalized assistance via the AI Sparkle FAB.

- [ ] Task: Implement the persistent Floating Action Button (FAB) on Home and Discovery screens.
- [ ] Task: Build the Chatbot interface in a slide-up modal/overlay.
    - [ ] Write tests for chat message state and API interaction.
    - [ ] Connect to the existing Python Vector Service via the Node.js gateway.
- [ ] Task: Conductor - User Manual Verification 'Phase 6: AI Chatbot Integration' (Protocol in workflow.md)

## Phase 7: Final Integration & Polish
Goal: Ensure stability, performance, and cross-platform consistency.

- [ ] Task: Run comprehensive E2E tests using Detox or Cypress (if applicable to the chosen mobile test stack).
- [ ] Task: Optimize image loading and list performance (FlatLists).
- [ ] Task: Perform final brand and UI polish.
- [ ] Task: Conductor - User Manual Verification 'Phase 7: Final Integration & Polish' (Protocol in workflow.md)
