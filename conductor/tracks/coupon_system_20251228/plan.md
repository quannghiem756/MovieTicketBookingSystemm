# Plan: Coupon/Voucher System

## Phase 1: Backend Core - Data Model & Repository
- [x] Task: Create `Coupon` Mongoose model (`backend/src/infrastructure/CouponModel.js`) with fields for code, type, value, dates, limits, and restrictions. 7eda1ed
- [x] Task: Create `Coupon` Domain Entity (`backend/src/domain/Coupon.js`) and Repository Interface. 4f54e4e
- [ ] Task: Implement `CouponRepository` (`backend/src/infrastructure/repositories/CouponRepository.js`).
- [ ] Task: Write unit tests for `CouponRepository` to verify CRUD and query methods.
- [ ] Task: Conductor - User Manual Verification 'Backend Core - Data Model & Repository' (Protocol in workflow.md)

## Phase 2: Backend - Admin Coupon Management API
- [ ] Task: Create `CouponService` (`backend/src/application/CouponService.js`) with methods for creating, updating, and listing coupons.
- [ ] Task: Create `AdminCouponController` to expose CRUD endpoints (GET /admin/coupons, POST /admin/coupons, etc.).
- [ ] Task: Register new routes in `backend/server.js` (or appropriate route loader).
- [ ] Task: Write integration tests for Admin Coupon APIs.
- [ ] Task: Conductor - User Manual Verification 'Backend - Admin Coupon Management API' (Protocol in workflow.md)

## Phase 3: Backend - Coupon Validation & Booking Integration
- [ ] Task: Implement `validateCoupon` method in `CouponService` checking for expiry, minimum order value, and global/user limits.
- [ ] Task: Create a public API endpoint `POST /coupons/validate` for the frontend to check code validity and get discount details before booking.
- [ ] Task: Update `BookingService.createBooking` to accept an optional `couponCode`.
- [ ] Task: Implement atomic usage increment logic in `BookingService` to handle concurrency (race conditions).
- [ ] Task: Update `Booking` model to store `couponCode`, `discountAmount`, and `finalPrice`.
- [ ] Task: Write unit tests for `BookingService` covering valid/invalid coupons, expired codes, and limit enforcement.
- [ ] Task: Conductor - User Manual Verification 'Backend - Coupon Validation & Booking Integration' (Protocol in workflow.md)

## Phase 4: Frontend - Admin Panel Implementation
- [ ] Task: Create `CouponList` component in Admin Dashboard to display existing coupons.
- [ ] Task: Create `CouponForm` modal/page for creating and editing coupons (inputs for code, discount type, value, dates, restrictions).
- [ ] Task: Integrate `AdminCouponService` in frontend to communicate with backend APIs.
- [ ] Task: Conductor - User Manual Verification 'Frontend - Admin Panel Implementation' (Protocol in workflow.md)

## Phase 5: Frontend - User Checkout Integration
- [ ] Task: Update `BookingPage` (or Checkout component) to include a "Promo Code" input field and "Apply" button.
- [ ] Task: Integrate `validateCoupon` API to check the code when clicked and display the discount amount/new total.
- [ ] Task: Update the final booking submission to include the applied `couponCode`.
- [ ] Task: Ensure the UI handles error messages (e.g., "Coupon Expired", "Min Order Not Met") gracefully.
- [ ] Task: Conductor - User Manual Verification 'Frontend - User Checkout Integration' (Protocol in workflow.md)

## Phase 6: End-to-End Verification
- [ ] Task: Perform a full E2E test: Admin creates a "Limited Time" coupon -> User applies it -> Booking created with discount -> Coupon usage count increments.
- [ ] Task: Verify usage limits block subsequent attempts (if limit is 1).
- [ ] Task: Conductor - User Manual Verification 'End-to-End Verification' (Protocol in workflow.md)
