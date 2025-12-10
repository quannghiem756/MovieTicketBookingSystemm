# Booking Service Workflow

## Create Booking

### Actors
- Frontend (Client)
- Booking Routes
- Booking Controller
- Booking Service
- MongoBooking Repository

### Workflow
1. **Frontend** sends a POST request to `/bookings` endpoint with booking data (showtimeId, userId, seatIds)
2. **Booking Routes** receives the request and validates the request body format and required fields
3. **Booking Routes** calls the controller method `createBooking()`
4. **Booking Controller** validates the booking data structure and required fields
5. **Booking Controller** calls the service method `createBooking(bookingData)`
6. **Booking Service** validates business rules (seat availability, showtime validity, user existence, etc.)
7. **Booking Service** checks seat availability and conflicts
8. **Booking Service** calls the repository method `create(booking)` to save the booking to the database
9. **MongoBooking Repository** creates the booking in the database
10. **MongoBooking Repository** returns the created booking data to the **Booking Service**
11. **Booking Service** returns the booking data to the **Booking Controller**
12. **Booking Controller** returns the booking data to **Booking Routes**
13. **Booking Routes** returns the booking data to **Frontend**

### Data Flow
- Request: POST `/bookings` with booking data
- Repository Operation: `create(booking)`
- Response: Created booking object with details

### Validation Points
- **Booking Routes**: Validates request body format, content type, and presence of required fields
- **Booking Controller**: Validates data structure and field types
- **Booking Service**: Validates business rules (seat availability, showtime existence, user validity, etc.)
- **MongoBooking Repository**: Validates data integrity constraints at database level

### Success Path
- All components successfully pass data between each other
- Booking is successfully created in the database
- Frontend receives the complete booking information

### Error Path
- Invalid request format results in 400 error at route level
- Business rule violations result in 400/409 errors at service level
- Database constraint violations result in 409/500 errors

## Get Booking by ID

### Actors
- Frontend (Client)
- Booking Routes
- Booking Controller
- Booking Service
- MongoBooking Repository

### Workflow
1. **Frontend** sends a GET request to `/bookings/:id` endpoint
2. **Booking Routes** receives the request and validates the booking ID format in the URL
3. **Booking Routes** calls the controller method `getBooking()`
4. **Booking Controller** validates the booking ID parameter format
5. **Booking Controller** calls the service method `getBooking(bookingId)`
6. **Booking Service** validates the booking ID format and access permissions
7. **Booking Service** calls the repository method `findById(bookingId)` to retrieve booking from the database
8. **MongoBooking Repository** retrieves the booking data from the database
9. **MongoBooking Repository** returns the booking data to the **Booking Service**
10. **Booking Service** returns the booking data to the **Booking Controller** (excluding sensitive information)
11. **Booking Controller** returns the booking data to **Booking Routes**
12. **Booking Routes** returns the booking data to **Frontend**

### Data Flow
- Request: GET `/bookings/:id`
- Repository Query: `findById(bookingId)`
- Response: Booking object with details

### Validation Points
- **Booking Routes**: Validates booking ID format in URL path parameter
- **Booking Controller**: Validates booking ID parameter format and type
- **Booking Service**: Validates booking ID format and checks access permissions
- **MongoBooking Repository**: Validates data integrity constraints at database level

### Success Path
- All components successfully pass data between each other
- Booking is successfully retrieved from the database
- Frontend receives the booking information

### Error Path
- Invalid booking ID format results in 400 error at route level
- Unauthorized access results in 403 error at service level
- Booking not found results in 404 error at service level
- Database constraint violations result in 409/500 errors

## Get Bookings by User

### Actors
- Frontend (Client)
- Booking Routes
- Booking Controller
- Booking Service
- MongoBooking Repository

### Workflow
1. **Frontend** sends a GET request to `/bookings/user/:userId` endpoint with authentication token
2. **Booking Routes** receives the request and validates the authentication token and user ID format
3. **Booking Routes** authenticates the user and checks authorization
4. **Booking Routes** calls the controller method `getBookingsByUser()`
5. **Booking Controller** validates the user ID parameter format and authorization context
6. **Booking Controller** calls the service method `getBookingsByUser(userId)`
7. **Booking Service** validates the user ID format and access permissions
8. **Booking Service** calls the repository method `findByUserId(userId)` to retrieve user's bookings from the database
9. **MongoBooking Repository** retrieves the booking data for the user from the database
10. **MongoBooking Repository** returns the booking list to the **Booking Service**
11. **Booking Service** returns the booking list to the **Booking Controller** (excluding sensitive information)
12. **Booking Controller** returns the booking list to **Booking Routes**
13. **Booking Routes** returns the booking list to **Frontend**

### Data Flow
- Request: GET `/bookings/user/:userId` with authentication
- Repository Query: `findByUserId(userId)`
- Response: List of booking objects for the user

### Validation Points
- **Booking Routes**: Validates authentication token format and user ID format
- **Booking Controller**: Validates user ID parameter format and authorization context
- **Booking Service**: Validates user ID format and checks access permissions
- **MongoBooking Repository**: Validates data integrity constraints at database level

### Success Path
- All components successfully pass data between each other
- User's bookings are successfully retrieved from the database
- Frontend receives the user's booking information

### Error Path
- Invalid token or user ID format results in 400/401 error at route level
- Unauthorized access results in 403 error at service level
- Database constraint violations result in 409/500 errors

## Cancel Booking

### Actors
- Frontend (Client)
- Booking Routes
- Booking Controller
- Booking Service
- MongoBooking Repository

### Workflow
1. **Frontend** sends a PUT/PATCH request to `/bookings/:id/cancel` endpoint with booking ID
2. **Booking Routes** receives the request and validates the booking ID format in the URL
3. **Booking Routes** authenticates the user and checks authorization to cancel the booking
4. **Booking Routes** calls the controller method `cancelBooking()`
5. **Booking Controller** validates the booking ID parameter format and authorization context
6. **Booking Controller** calls the service method `cancelBooking(bookingId)`
7. **Booking Service** validates the booking ID format, checks booking existence, and verifies cancellation eligibility
8. **Booking Service** updates the booking status to 'cancelled' in the database
9. **Booking Service** calls the repository method `updateStatus(bookingId, 'cancelled')` to update booking status
10. **MongoBooking Repository** updates the booking record in the database
11. **MongoBooking Repository** returns the updated booking data to the **Booking Service**
12. **Booking Service** returns the updated booking data to the **Booking Controller**
13. **Booking Controller** returns the booking data to **Booking Routes**
14. **Booking Routes** returns the booking data to **Frontend**

### Data Flow
- Request: PUT/PATCH `/bookings/:id/cancel` with booking ID
- Repository Operation: `updateStatus(bookingId, 'cancelled')`
- Response: Updated booking object with cancelled status

### Validation Points
- **Booking Routes**: Validates booking ID format in URL path parameter and user authorization
- **Booking Controller**: Validates booking ID parameter format and authorization context
- **Booking Service**: Validates booking ID format, checks existence, and verifies cancellation eligibility (e.g., not already cancelled, within cancellation window)
- **MongoBooking Repository**: Validates data integrity constraints at database level

### Success Path
- All components successfully pass data between each other
- Booking is successfully cancelled in the database
- Frontend receives the updated booking information with cancelled status

### Error Path
- Invalid booking ID format results in 400 error at route level
- Unauthorized access results in 403 error at service level
- Invalid cancellation attempt (e.g., already cancelled, past showtime) results in 400/409 error at service level
- Database constraint violations result in 409/500 errors