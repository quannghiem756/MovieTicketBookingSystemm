# Movie Ticket Booking API Documentation

## Overview
This document provides documentation for the Movie Ticket Booking REST API, which follows Domain-Driven Design principles.

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require authentication via JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <token>
```

## Error Responses
All error responses follow this format:
```json
{
  "error": "Error message"
}
```

## Movies

### Get all movies
```
GET /movies
```
Returns a list of all movies.

### Get now showing movies
```
GET /movies/now-showing
```
Returns a list of currently showing movies.

### Get coming soon movies
```
GET /movies/coming-soon
```
Returns a list of upcoming movies.

### Get movie by ID
```
GET /movies/{id}
```
Returns details of a specific movie.

### Create movie
```
POST /movies
```
Creates a new movie.

**Request Body:**
```json
{
  "title": "string",
  "director": "string",
  "cast": ["string"],
  "synopsis": "string",
  "duration": "number",
  "genre": ["string"],
  "rating": "string",
  "posterUrl": "string",
  "trailerUrl": "string",
  "releaseDate": "date",
  "endDate": "date"
}
```

### Update movie
```
PUT /movies/{id}
```
Updates an existing movie.

### Delete movie
```
DELETE /movies/{id}
```
Deletes a movie.

## Showtimes

### Get showtimes by movie ID
```
GET /showtimes/movie/{movieId}
```
Returns all showtimes for a specific movie.

### Get showtime by ID
```
GET /showtimes/{id}
```
Returns details of a specific showtime.

### Create showtime
```
POST /showtimes
```
Creates a new showtime.

**Request Body:**
```json
{
  "movieId": "string",
  "theaterId": "string",
  "showDate": "date",
  "showTime": "string",
  "format": "string",
  "language": "string",
  "price": "number"
}
```

### Update showtime
```
PUT /showtimes/{id}
```
Updates an existing showtime.

### Delete showtime
```
DELETE /showtimes/{id}
```
Deletes a showtime.

## Bookings

### Get bookings by user ID
```
GET /bookings/user/{userId}
```
Returns all bookings for a specific user.

### Get booking by ID
```
GET /bookings/{id}
```
Returns details of a specific booking.

### Create booking
```
POST /bookings
```
Creates a new booking.

**Request Body:**
```json
{
  "userId": "string",
  "showtimeId": "string",
  "seatIds": ["string"],
  "totalPrice": "number"
}
```

### Confirm booking
```
PUT /bookings/{id}/confirm
```
Confirms a pending booking.

### Cancel booking
```
PUT /bookings/{id}/cancel
```
Cancels an existing booking.

## Users

### Create user
```
POST /users
```
Registers a new user.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "password": "string",
  "dateOfBirth": "date"
}
```

### Login user
```
POST /users/login
```
Authenticates a user.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

### Get user by ID
```
GET /users/{id}
```
Returns details of a specific user.

### Get user by email
```
GET /users/email/{email}
```
Returns details of a user by email.

### Update user
```
PUT /users/{id}
```
Updates an existing user.

### Delete user
```
DELETE /users/{id}
```
Deletes a user.