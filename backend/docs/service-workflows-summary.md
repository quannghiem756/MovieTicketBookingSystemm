# Service Workflows Summary

This document provides an overview of all service workflows in the Movie Ticket Booking System with validation points.

## Available Service Workflows

### 1. [Movie Service](./movie-service-workflow.md)
- **Operation**: Get All Movies
- **Validation Points**: Route parameter validation, controller data validation, service business logic validation
- **Operation**: Get Movie by ID
- **Validation Points**: Route parameter validation, controller ID validation, service existence validation
- **Operation**: Create Movie
- **Validation Points**: Route body validation, controller structure validation, service data format validation
- **Operation**: Update Movie
- **Validation Points**: Route parameter and body validation, controller ID and data validation, service existence validation
- **Operation**: Delete Movie
- **Validation Points**: Route parameter validation, controller ID validation, service existence validation

### 2. [Payment Service](./payment-service-workflow.md)
- **Operation**: Create MoMo Payment URL
- **Validation Points**: Route parameter validation, service booking validation, MoMo API response validation
- **Operation**: Payment Callback Processing
- **Validation Points**: Route authentication validation, service callback validation, MoMo verification

### 3. [Booking Service](./booking-service-workflow.md)
- **Operation**: Create Booking
- **Validation Points**: Route body validation, controller structure validation, service business rule validation
- **Operation**: Get Booking by ID
- **Validation Points**: Route parameter validation, controller ID validation, service access validation
- **Operation**: Get Bookings by User
- **Validation Points**: Route authentication validation, controller ID validation, service permission validation
- **Operation**: Cancel Booking
- **Validation Points**: Route parameter and authorization validation, controller ID validation, service eligibility validation

### 4. [User Service](./user-service-workflow.md)
- **Operation**: User Registration
- **Validation Points**: Route body validation, controller structure validation, service data format validation
- **Operation**: User Login
- **Validation Points**: Route credentials validation, controller structure validation, service authentication validation
- **Operation**: Get User Profile
- **Validation Points**: Route authentication validation, controller context validation, service permission validation

### 5. [Theater Service](./theater-service-workflow.md)
- **Operation**: Get All Theaters
- **Validation Points**: Route parameter validation, controller data validation, service business logic validation
- **Operation**: Get Theater by ID
- **Validation Points**: Route parameter validation, controller ID validation, service existence validation
- **Operation**: Create Theater
- **Validation Points**: Route body validation, controller structure validation, service data format validation
- **Operation**: Update Theater
- **Validation Points**: Route parameter and body validation, controller ID and data validation, service existence validation
- **Operation**: Delete Theater
- **Validation Points**: Route parameter validation, controller ID validation, service existence validation

### 6. [Showtime Service](./showtime-service-workflow.md)
- **Operation**: Get All Showtimes
- **Validation Points**: Route parameter validation, controller data validation, service business logic validation
- **Operation**: Get Showtime by ID
- **Validation Points**: Route parameter validation, controller ID validation, service existence validation
- **Operation**: Create Showtime
- **Validation Points**: Route body validation, controller structure validation, service data format validation
- **Operation**: Update Showtime
- **Validation Points**: Route parameter and body validation, controller ID and data validation, service existence and conflict validation
- **Operation**: Delete Showtime
- **Validation Points**: Route parameter validation, controller ID validation, service existence and booking validation

### 7. [Recommendation Service](./recommendation-service-workflow.md)
- **Operation**: Get Movie Recommendations
- **Validation Points**: Route body validation, controller data validation, service query validation

## Common Validation Patterns

### Route Level Validation
- Request body format and content type
- URL parameter format and validity
- Authentication token format and validity
- Required field presence

### Controller Level Validation
- Data structure validation
- Field type validation
- Basic format validation
- Authenticated user context validation

### Service Level Validation
- Business rule validation
- Cross-service data validation
- External API response validation
- Access permission validation
- Data integrity and conflict checks

### Repository Level Validation
- Data integrity constraints
- Database-specific validation

## Error Handling Strategy

Each service follows a consistent error handling approach:
- 400 Bad Request: Invalid input format or validation failures
- 401 Unauthorized: Authentication required or failed
- 403 Forbidden: Access denied due to insufficient permissions
- 404 Not Found: Resource not found
- 409 Conflict: Data conflict (e.g., duplicate user, time conflict)
- 500 Internal Server Error: System errors or external service failures