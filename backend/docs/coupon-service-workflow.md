# Coupon Service Workflow

This document details the workflow for Coupon Management and Application within the Movie Ticket Booking System.

## Overview
The Coupon Service manages the lifecycle of promotional codes and validates them during the booking process. It handles both administrative management and user-facing validation.

## 1. Administrative Coupon Management

### Create Coupon
- **Operation**: `POST /api/coupons`
- **Controller**: `AdminCouponController.createCoupon`
- **Validation Points**:
    - **Route Level**: Admin authentication and authorization.
    - **Controller Level**: Required fields (code, type, value, dates).
    - **Service Level**: Code uniqueness, date range validity (start < end).
- **Result**: New coupon created in the database.

### Update Coupon
- **Operation**: `PUT /api/coupons/:id`
- **Controller**: `AdminCouponController.updateCoupon`
- **Validation Points**:
    - **Route Level**: Admin authentication and authorization.
    - **Service Level**: Existence check, date range validity.
- **Result**: Updated coupon record.

### Delete Coupon
- **Operation**: `DELETE /api/coupons/:id`
- **Controller**: `AdminCouponController.deleteCoupon`
- **Validation Points**:
    - **Route Level**: Admin authentication and authorization.
- **Result**: Coupon removed from database.

## 2. User Coupon Application

### Validate Coupon
- **Operation**: `POST /api/coupons/validate`
- **Controller**: `CouponController.validateCoupon`
- **Flow**:
    1. Check if the code exists.
    2. Verify current date is between `startDate` and `endDate`.
    3. Verify `currentUsage` < `usageLimit` (if limit set).
    4. Verify user hasn't exceeded `userUsageLimit` (checked via `BookingRepository`).
    5. Verify `orderTotal` >= `minOrderValue`.
    6. Verify `movieId` is in `applicableMovieIds` (if restricted).
- **Validation Points**:
    - **Route Level**: Authentication required (to check per-user limits).
    - **Service Level**: Expiry, usage limits, minimum order value, and movie restrictions.
- **Result**: Returns validation status and calculated `discountAmount`.

## 3. Booking Integration Workflow

### Applying Coupon during Booking
- **Operation**: `POST /api/bookings`
- **Service**: `BookingService.createBooking`
- **Flow**:
    1. If `couponCode` is provided, call `CouponService.validateCoupon`.
    2. If valid, calculate `finalPrice = originalPrice - discountAmount`.
    3. Execute atomic `CouponService.incrementUsage(code)` to prevent race conditions.
    4. Save booking with `couponCode`, `originalPrice`, and `discountAmount`.
- **Race Condition Handling**: The `incrementUsage` operation uses MongoDB's `findOneAndUpdate` with a condition `currentUsage < usageLimit` to ensure atomic limit enforcement.

### Reverting Coupon Usage
- **Operation**: `PUT /api/bookings/:id/cancel`
- **Flow**:
    1. If booking has an associated `couponCode`.
    2. Call `CouponService.decrementUsage(code)`.
    3. Update booking status to `cancelled`.
- **Result**: `currentUsage` is decremented in the coupon record.

## Data Structure

### Coupon Model
- `code`: String (Unique, Alphanumeric)
- `type`: String (ENUM: 'PERCENTAGE', 'FIXED')
- `value`: Number
- `startDate`: Date
- `endDate`: Date
- `usageLimit`: Number (Global)
- `userUsageLimit`: Number (Per-user)
- `minOrderValue`: Number
- `applicableMovieIds`: Array of ObjectIds
- `currentUsage`: Number

## Biểu đồ tuần tự

```mermaid
sequenceDiagram
    actor Admin as Quản trị viên
    actor User as Người dùng
    participant Route as Coupon Routes
    participant Controller as Coupon Controller
    participant Service as Coupon Service
    participant Repo as Coupon Repository
    participant Booking as Booking Service

    %% Admin Management
    Note over Admin, Repo: 1. Quản lý Coupon (Admin)
    Admin->>Route: POST /api/coupons (Tạo Coupon)
    Route->>Controller: createCoupon()
    Controller->>Service: createCoupon(data)
    Service->>Service: Validate (Mã duy nhất, Ngày hợp lệ)
    Service->>Repo: Lưu Coupon
    Repo-->>Service: Coupon đã tạo
    Service-->>Controller: Coupon
    Controller-->>Admin: 201 Created

    %% User Validation
    Note over User, Booking: 2. Áp dụng Coupon (User)
    User->>Route: POST /api/coupons/validate
    Route->>Controller: validateCoupon()
    Controller->>Service: validateCoupon(code, userId, orderTotal)
    Service->>Repo: Tìm Coupon theo code
    Repo-->>Service: Coupon Data
    Service->>Service: Kiểm tra điều kiện (Hạn, Giới hạn dùng, Giá trị đơn)
    alt Không hợp lệ
        Service-->>Controller: Lỗi (Hết hạn / Không tồn tại)
        Controller-->>User: 400 Bad Request
    else Hợp lệ
        Service-->>Controller: Thông tin giảm giá
        Controller-->>User: 200 OK (Số tiền giảm)
    end

    %% Booking Integration
    Note over User, Booking: 3. Tích hợp khi Đặt vé
    User->>Booking: POST /api/bookings (Kèm mã Coupon)
    Booking->>Service: validateCoupon(code)
    alt Coupon Hợp lệ
        Service-->>Booking: Discount Amount
        Booking->>Booking: Tính Final Price = Original - Discount
        Booking->>Service: incrementUsage(code)
        Service->>Repo: findOneAndUpdate(inc usage)
        Repo-->>Service: Updated Coupon
        Booking->>Repo: Lưu Booking (kèm thông tin giảm giá)
        Booking-->>User: Booking Confirmed
    else Coupon Không hợp lệ
        Service-->>Booking: Error
        Booking-->>User: 400 Bad Request
    end
```
