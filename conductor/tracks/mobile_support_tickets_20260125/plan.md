# Implementation Plan: Mobile Support Ticket System

Implement the "Contact Us" form and Ticket Details/Reply functionality in the React Native app, including deep linking support and bilingual translations.

## Phase 1: Foundation & Translations [checkpoint: 48a45fc]
Set up the service layer and ensure all necessary translation keys are present.

- [x] Task: Update `i18n` translations for support categories and form labels [8f632ca]
    - [x] Add support keys to `mobile-app/src/translations/en.ts`
    - [x] Add support keys to `mobile-app/src/translations/vi.ts`
- [x] Task: Create `supportService` for mobile [4e92838]
    - [x] Implement `createTicket(ticketData)`
    - [x] Implement `getTicketByToken(token)`
    - [x] Implement `replyToTicket(token, content)`
- [x] Task: Conductor - User Manual Verification 'Phase 1: Foundation & Translations' (Protocol in workflow.md) [48a45fc]

## Phase 2: Contact Us Form
Implement the submission UI and logic.

- [x] Task: Create `ContactUsScreen` component [67e420a]
    - [ ] Implement form with Name, Email, Phone, Category, and Message fields
    - [ ] Add validation logic and pre-filling for logged-in users
- [ ] Task: Integrate `ContactUsScreen` into `ProfileScreen`
    - [ ] Add "Help & Support" section to `ProfileScreen` UI
    - [ ] Set up navigation in `AppNavigator`
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Contact Us Form' (Protocol in workflow.md)

## Phase 3: Ticket Details & Deep Linking
Implement viewing/replying to tickets and handling email links.

- [ ] Task: Create `TicketDetailsScreen` component
    - [ ] Implement conversation thread display
    - [ ] Implement reply form
- [ ] Task: Configure Deep Linking for Support Tickets
    - [ ] Update `linking` configuration in `AppNavigator.tsx` to handle `support/ticket/:token`
    - [ ] Add `TicketDetails` to the navigation stack
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Ticket Details & Deep Linking' (Protocol in workflow.md)

## Phase 4: Final Polish & Verification
Final testing and ensuring a smooth user experience.

- [ ] Task: Final UI/UX review and I18n verification
    - [ ] Check keyboard avoiding behavior on both iOS and Android
    - [ ] Verify both languages in all new screens
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Final Polish & Verification' (Protocol in workflow.md)
