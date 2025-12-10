# Payment Service Workflow

## Create MoMo Payment URL

### Actors
- Frontend (Client)
- Payment Routes
- Payment Service
- Booking Repository
- MoMo API

### Workflow
1. **Frontend** sends a POST request to `/create/:bookingId` endpoint
2. **Payment Routes** receives the request and validates the booking ID format in the URL
3. **Payment Routes** calls the service method `createMomoPaymentUrl(bookingId)`
4. **Payment Service** validates the booking ID format and business rules (e.g., booking exists, not already paid)
5. **Payment Service** calls the repository method `findById(bookingId)` to retrieve booking details
6. **Booking Repository** retrieves the booking data from the database
7. **Booking Repository** returns the booking data to the **Payment Service**
8. **Payment Service** validates booking status and amount before payment processing
9. **Payment Service** makes a POST request to the MoMo API with validated booking information
10. **MoMo API** processes the payment request, validates payment parameters, and generates a payment URL
11. **MoMo API** returns the payment URL to the **Payment Service**
12. **Payment Service** validates the response from MoMo API
13. **Payment Service** returns the payment URL to **Payment Routes**
14. **Payment Routes** returns the payment URL to **Frontend**

### Data Flow
- Request: POST `/create/:bookingId`
- Repository Query: `findById(bookingId)`
- External API Call: POST to MoMo API
- Response: Payment URL

### Validation Points
- **Payment Routes**: Validates booking ID format in URL path parameter
- **Payment Service**: Validates booking exists, has valid status for payment, and correct amount
- **Payment Service**: Validates response from MoMo API before returning to frontend
- **MoMo API**: Validates payment parameters (amount, description, etc.)

### Success Path
- All components successfully pass data between each other
- MoMo API returns a valid payment URL
- Frontend receives the payment URL to redirect the user

### Error Path
- Invalid booking ID format results in 400 error at route level
- Invalid booking status results in 400/403 error at service level
- MoMo API validation failures result in appropriate error responses

## Payment Callback Processing

### Actors
- MoMo API
- Payment Routes
- Payment Service
- Booking Repository

### Workflow
1. **MoMo API** sends a payment callback notification to the `/callback` endpoint
2. **Payment Routes** receives the callback and validates the MoMo signature/authentication
3. **Payment Routes** calls the service method to process the payment callback
4. **Payment Service** validates the callback data format and content
5. **Payment Service** verifies the payment status and information with MoMo API
6. **Payment Service** updates the booking status in the database based on payment result
7. **Payment Service** calls the repository method `updatePaymentStatus()` to update the booking
8. **Booking Repository** updates the booking record in the database
9. **Booking Repository** returns the result to the **Payment Service**
10. **Payment Service** returns the callback processing result to **Payment Routes**
11. **Payment Routes** returns an acknowledgment to **MoMo API**

### Data Flow
- Request: POST `/callback` with payment callback data from MoMo
- Repository Operation: `updatePaymentStatus()`
- Response: Acknowledgment to MoMo API

### Validation Points
- **Payment Routes**: Validates MoMo signature and authentication
- **Payment Service**: Validates callback data format, payment status, and booking information
- **Payment Service**: Verifies payment status with MoMo API
- **Booking Repository**: Validates data integrity constraints at database level

### Success Path
- All components successfully process the payment callback
- Booking status is updated based on payment result
- MoMo API receives acknowledgment

### Error Path
- Invalid MoMo signature results in 401 error at route level
- Invalid callback data results in 400 error at service level
- Database constraint violations result in 409/500 errors