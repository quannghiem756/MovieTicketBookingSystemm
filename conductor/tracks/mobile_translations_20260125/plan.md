# Implementation Plan - Mobile Translation Completion

## Phase 1: Authentication & User Domain [checkpoint: 66f5140]
- [x] Task: Audit and translate Authentication screens (Login, Register, OTP) e9b4faa
    - [x] Analyze `LoginScreen.tsx`, `RegisterScreen.tsx`, `OtpVerificationScreen.tsx` for hardcoded strings.
    - [x] Update `en.ts` and `vi.ts` with new keys.
    - [x] Replace strings with `t()` hooks.
    - [x] Verify using unit tests or manual walkthrough.
- [x] Task: Audit and translate User Profile & Settings ce526aa
    - [x] Analyze `ProfileScreen.tsx` and related components.
    - [x] Update translation files.
    - [x] Replace strings and verify.
- [x] Task: Conductor - User Manual Verification 'Authentication & User Domain' (Protocol in workflow.md) 66f5140

## Phase 2: Movie Discovery & Details [checkpoint: 833d408]
- [x] Task: Audit and translate Movie Listing & Filtering ce526aa
    - [x] Analyze `HomeScreen.tsx`, `MovieList.tsx` and filter components.
    - [x] Identify hardcoded categories, button labels, and empty states.
    - [x] Update translations and implement `t()`.
- [x] Task: Audit and translate Movie Details 6e9f218
    - [x] Analyze `MovieDetailsScreen.tsx`.
    - [x] Handle static labels (e.g., "Cast", "Director", "Showtimes").
    - [x] Update translations and implement `t()`.
- [x] Task: Conductor - User Manual Verification 'Movie Discovery & Details' (Protocol in workflow.md) 833d408

## Phase 3: Booking Workflow & Payments [checkpoint: f5b515c]
- [x] Task: Audit and translate Seat Selection & Booking ce28528
    - [x] Analyze `SeatSelectionScreen.tsx` and booking summary.
    - [x] Translate legends (Available, Taken, Selected) and alerts.
    - [x] Update translation files.
- [x] Task: Audit and translate Payment & Coupons 0b4b355
    - [x] Analyze `CheckoutScreen.tsx` and coupon modals.
    - [x] Translate payment instruction prompts and success/failure messages.
    - [x] Update translations and implement `t()`.
- [x] Task: Conductor - User Manual Verification 'Booking Workflow & Payments' (Protocol in workflow.md) f5b515c

## Phase 4: Support, News & Chatbot
- [x] Task: Audit and translate Support & News 634b33f
    - [x] Analyze `SupportScreen.tsx`, `NewsDetailScreen.tsx`.
    - [x] Translate form labels, status badges, and static headers.
    - [x] Update translation files.
- [x] Task: Audit and translate AI Chatbot 634b33f
    - [x] Analyze `Chatbot.tsx` (Floating Action Button and Chat Interface).
    - [x] Translate system messages (e.g., "How can I help you?", "Thinking...").
    - [x] Update translations and implement `t()`.
- [~] Task: Conductor - User Manual Verification 'Support, News & Chatbot' (Protocol in workflow.md)

## Phase 5: Global UI & Final Polish
- [ ] Task: Audit General UI Components
    - [ ] Check `navigation/AppNavigator.tsx` for screen titles.
    - [ ] Check shared components (Modals, Custom Alerts, Loading Spinners).
    - [ ] Ensure `I18nContext` handles fallback gracefully.
- [ ] Task: Final Translation Consistency Check
    - [ ] Review `vi.ts` for tone consistency (formal vs. informal).
    - [ ] Ensure no placeholder keys remain visible.
- [ ] Task: Conductor - User Manual Verification 'Global UI & Final Polish' (Protocol in workflow.md)
