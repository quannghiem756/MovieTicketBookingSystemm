# Specification: Coupon/Voucher System

## Overview
Add a comprehensive coupon and voucher system to the movie ticket booking platform. This feature will allow administrators to create promotional codes and users to apply them during the checkout process to receive discounts.

## Functional Requirements

### 1. Coupon Management (Admin Panel)
- **CRUD Operations:** Administrators can create, view, update, and delete coupons.
- **Coupon Attributes:**
    - **Code:** Unique alphanumeric code (e.g., SAVE10).
    - **Type:** Percentage-based or Fixed amount.
    - **Value:** The discount amount (e.g., 10% or $5).
    - **Validity Period:** Start and End dates/times.
    - **Usage Limits:**
        - Global limit (total number of times the coupon can be used).
        - Per-user limit (number of times a single user can use the coupon, typically 1).
    - **Restrictions:**
        - Minimum order value required to apply.
        - Movie-specific restrictions (optional).
- **Dashboard:** List all coupons with their current usage status and validity.

### 2. Coupon Application (User/Booking Flow)
- **Checkout Integration:** Add a "Coupon Code" input field on the Booking Summary/Checkout page.
- **Validation:** When applied, the system must validate:
    - Code existence and active status.
    - Current date is within the validity period.
    - Minimum order value is met.
    - Global usage limit has not been reached.
    - Per-user usage limit for the authenticated user has not been reached.
    - Movie eligibility (if the coupon is restricted to specific movies).
- **Price Calculation:** Dynamically update the total booking price and display the discount amount applied.
- **Single Use:** Only one coupon can be applied per booking.

### 3. Order & Payment Integration
- **Booking Record:** Store the coupon code and discount amount in the booking record.
- **Payment Processing:** Ensure the final amount sent to the payment gateway (MoMo) reflects the discounted price.

## Non-Functional Requirements
- **Concurrency:** Handle race conditions for coupons with strict global limits (e.g., "First 100 users") to prevent over-redemption.
- **Security:** Ensure users cannot manipulate the discount amount via client-side requests. Validation must happen on the backend during the booking finalization.

## Acceptance Criteria
- Administrators can create a 10% discount coupon limited to "Avatar 2" with a global limit of 50 uses.
- Users see an error message if they try to use an expired coupon or if the minimum order value isn't met.
- The discount is correctly subtracted from the total before the user is redirected to MoMo.
- A user cannot use the same "one-per-user" coupon twice across different bookings.

## Out of Scope
- Referral codes (user-to-user).
- Stacking multiple coupons.
- Automatic application of "best available" coupon.
