# Specification: Payment Flow & Seat Selection Timeout Analysis

## Overview
This track aims to analyze and optimize the seat selection timeout mechanism throughout the payment process. Currently, a 10-minute limit is enforced during seat selection, but its behavior during the transition to and from the MoMo payment gateway is unclear. The goal is to ensure a seamless and robust booking experience where seats are held reliably while the user completes their payment.

## Functional Requirements
- **Analyze Seat-Hold Logic:**
  - Investigate the backend mechanism (Socket.io/Redis/MongoDB) for holding seats.
  - Determine how the 10-minute timer is initialized and tracked.
- **Frontend Timer Consistency:**
  - Verify if the timer is displayed on the payment/checkout screen.
  - Check if the timer accurately reflects the backend's seat-hold status.
- **Payment Gateway Transition:**
  - Analyze the behavior when the user is redirected to MoMo. Does the timer continue to count down?
  - Verify what happens if the user returns from MoMo *after* the 10-minute limit has expired.
- **Improvement Proposals:**
  - Propose a "Grace Period" or "Timer Extension" strategy when the user enters the payment phase.
  - Ensure the user is notified if their seat hold has expired before they complete the payment.

## Non-Functional Requirements
- **Reliability:** Seat-hold status must be consistent across the frontend and backend.
- **Performance:** Timer updates and seat releases should be handled efficiently via WebSockets.

## Acceptance Criteria
- A detailed report on the current seat-hold and payment flow behavior.
- Implementation of a 5-minute "Grace Period" extension when the user initiates a payment via MoMo.
- Clear UI feedback on the payment screen regarding the remaining time.
- Prevention of double-booking or booking expired seats.

## Out of Scope
- Redesigning the MoMo payment integration itself (except for timer-related logic).
- Adding new payment methods.