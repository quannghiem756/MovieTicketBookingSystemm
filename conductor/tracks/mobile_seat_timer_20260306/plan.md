# Implementation Plan: Mobile Seat-Hold Timer Persistence & Warning

## Phase 1: Shared State & Timer Logic [checkpoint: 5357de3]
- [x] Task: Create `BookingContext` and `BookingProvider` in `mobile-app/src/context/BookingContext.tsx` 5357de3
    - [x] Define state: `timeLeft`, `isTimerActive`, `heldSeats`.
    - [x] Implement `startTimer(seconds)`, `stopTimer()`, `resetTimer()`, `setHeldSeats(seats)`.
    - [x] Use `setInterval` to decrement `timeLeft` globally.
- [x] Task: Write tests for `BookingContext` in `mobile-app/src/context/BookingContext.test.tsx` 5357de3
    - [x] Verify `timeLeft` decrements every second.
    - [x] Verify `stopTimer` correctly halts the countdown.
    - [x] Verify state is shared correctly.
- [x] Task: Wrap the application with `BookingProvider` in `mobile-app/App.tsx`. 5357de3
- [x] Task: Conductor - User Manual Verification 'Phase 1: Shared State & Timer Logic' (Protocol in workflow.md) 5357de3

## Phase 2: SeatSelectionScreen Refactoring
- [x] Task: Create failing tests for SeatSelectionScreen refactoring fb96ea5
    - [x] Verify it uses the global timer state.
    - [x] Verify it calls `startTimer` upon successful seat hold.
- [x] Task: Refactor `SeatSelectionScreen.tsx` to use `BookingContext` fb96ea5
    - [x] Remove local `timeLeft` and `timerRef`.
    - [x] Replace with `useBooking()` context calls.
- [x] Task: Verify refactored `SeatSelectionScreen` with automated tests. fb96ea5
- [ ] Task: Conductor - User Manual Verification 'Phase 2: SeatSelectionScreen Refactoring' (Protocol in workflow.md)

## Phase 3: Checkout Screen Integration & Banner
- [ ] Task: Create `TimerBanner` component in `mobile-app/src/components/TimerBanner.tsx`
    - [ ] Design a non-intrusive banner using `react-native-paper` Surface.
    - [ ] Display MM:SS format for `timeLeft`.
- [ ] Task: Integrate `TimerBanner` into `CheckoutScreen.tsx`
    - [ ] Display banner at the top of the scroll view.
    - [ ] Implement auto-redirection logic: `if (timeLeft <= 0) navigation.goBack()`.
- [ ] Task: Write tests for `CheckoutScreen` timer integration
    - [ ] Verify the banner appears when a timer is active.
    - [ ] Verify auto-redirection occurs when `timeLeft` reaches zero.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Checkout Screen Integration & Banner' (Protocol in workflow.md)

## Phase 4: Localization & Final Polish
- [ ] Task: Add bilingual translations for timer-related labels in `en.ts` and `vi.ts`
- [ ] Task: Final end-to-end verification of the booking flow.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Localization & Final Polish' (Protocol in workflow.md)
