# Implementation Plan - Mobile Translation Completion

## Phase 1: Authentication & User Domain
- [x] Task: Audit and translate Authentication screens (Login, Register, OTP) e9b4faa
    - [x] Analyze `LoginScreen.tsx`, `RegisterScreen.tsx`, `OtpVerificationScreen.tsx` for hardcoded strings.
    - [ ] Update `en.ts` and `vi.ts` with new keys.
    - [ ] Replace strings with `t()` hooks.
    - [ ] Verify using unit tests or manual walkthrough.
- [x] Task: Audit and translate User Profile & Settings ce526aa
    - [x] Analyze `ProfileScreen.tsx` and related components.
    - [ ] Update translation files.
    - [ ] Replace strings and verify.
- [~] Task: Conductor - User Manual Verification 'Authentication & User Domain' (Protocol in workflow.md)

## Phase 2: Movie Discovery & Details
- [ ] Task: Audit and translate Movie Listing & Filtering
    - [ ] Analyze `HomeScreen.tsx`, `MovieList.tsx` and filter components.
    - [ ] Identify hardcoded categories, button labels, and empty states.
    - [ ] Update translations and implement `t()`.
- [ ] Task: Audit and translate Movie Details
    - [ ] Analyze `MovieDetailScreen.tsx`.
    - [ ] Handle static labels (e.g., "Cast", "Director", "Showtimes").
    - [ ] Update translations and implement `t()`.
- [ ] Task: Conductor - User Manual Verification 'Movie Discovery & Details' (Protocol in workflow.md)

## Phase 3: Booking Workflow & Payments
- [ ] Task: Audit and translate Seat Selection & Booking
    - [ ] Analyze `SeatSelectionScreen.tsx` and booking summary.
    - [ ] Translate legends (Available, Taken, Selected) and alerts.
    - [ ] Update translation files.
- [ ] Task: Audit and translate Payment & Coupons
    - [ ] Analyze `PaymentScreen.tsx` and coupon modals.
    - [ ] Translate payment instruction prompts and success/failure messages.
    - [ ] Update translations and implement `t()`.
- [ ] Task: Conductor - User Manual Verification 'Booking Workflow & Payments' (Protocol in workflow.md)

## Phase 4: Support, News & Chatbot
- [ ] Task: Audit and translate Support & News
    - [ ] Analyze `SupportScreen.tsx`, `NewsDetailScreen.tsx`.
    - [ ] Translate form labels, status badges, and static headers.
    - [ ] Update translation files.
- [ ] Task: Audit and translate AI Chatbot
    - [ ] Analyze `Chatbot.tsx` (Floating Action Button and Chat Interface).
    - [ ] Translate system messages (e.g., "How can I help you?", "Thinking...").
    - [ ] Update translations and implement `t()`.
- [ ] Task: Conductor - User Manual Verification 'Support, News & Chatbot' (Protocol in workflow.md)

## Phase 5: Global UI & Final Polish
- [ ] Task: Audit General UI Components
    - [ ] Check `navigation/AppNavigator.tsx` for screen titles.
    - [ ] Check shared components (Modals, Custom Alerts, Loading Spinners).
    - [ ] Ensure `I18nContext` handles fallback gracefully.
- [ ] Task: Final Translation Consistency Check
    - [ ] Review `vi.ts` for tone consistency (formal vs. informal).
    - [ ] Ensure no placeholder keys remain visible.
- [ ] Task: Conductor - User Manual Verification 'Global UI & Final Polish' (Protocol in workflow.md)
