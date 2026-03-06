# Implementation Plan: Mobile Seat-Hold Timer Persistence & Warning

## Phase 1: Shared State & Timer Logic
- [ ] Task: Create `BookingContext` and `BookingProvider` in `mobile-app/src/context/BookingContext.tsx`
    - [ ] Define state: `timeLeft`, `isTimerActive`, `heldSeats`.
    - [ ] Implement `startTimer(seconds)`, `stopTimer()`, `resetTimer()`, `setHeldSeats(seats)`.
    - [ ] Use `setInterval` to decrement `timeLeft` globally.
- [ ] Task: Write tests for `BookingContext` in `mobile-app/src/context/BookingContext.test.tsx`
    - [ ] Verify `timeLeft` decrements every second.
    - [ ] Verify `stopTimer` correctly halts the countdown.
    - [ ] Verify state is shared correctly.
- [ ] Task: Wrap the application with `BookingProvider` in `mobile-app/App.tsx`.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Shared State & Timer Logic' (Protocol in workflow.md)

## Phase 2: SeatSelectionScreen Refactoring
- [ ] Task: Create failing tests for `SeatSelectionScreen` refactoring
    - [ ] Verify it uses the global timer state.
    - [ ] Verify it calls `startTimer` upon successful seat hold.
- [ ] Task: Refactor `SeatSelectionScreen.tsx` to use `BookingContext`
    - [ ] Remove local `timeLeft` and `timerRef`.
    - [ ] Replace with `useBooking()` context calls.
- [ ] Task: Verify refactored `SeatSelectionScreen` with automated tests.
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
