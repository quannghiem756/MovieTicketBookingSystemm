# Entity Relationship Diagram - Movie Ticket Booking System

This diagram represents the core data entities and their relationships within the system.

```mermaid
erDiagram
    User ||--o{ Booking : "makes"
    User ||--o{ RefreshToken : "has"
    User {
        string id PK
        string name
        string email
        string phone
        string role
        boolean isVerified
        int loyaltyPoints
    }

    Movie ||--o{ Showtime : "features in"
    Movie {
        string id PK
        string title
        int duration
        string rating
        string genre
        date releaseDate
    }

    Theater ||--o{ Showtime : "hosts"
    Theater {
        string id PK
        string name
        string location
        int totalSeats
    }

    Showtime ||--o{ Booking : "has"
    Showtime {
        string id PK
        string movieId FK
        string theaterId FK
        date showDate
        string showTime
        string format
        float price
    }

    Booking {
        string id PK
        string userId FK
        string showtimeId FK
        string[] seatIds
        float totalPrice
        string status
        string paymentMethod
        string couponCode
    }

    Coupon |o--o{ Booking : "applied to"
    Coupon {
        string id PK
        string code
        string type
        float value
        string[] applicableMovieIds
    }

    News {
        string id PK
        string title
        string content
        date publishDate
    }
    
    RefreshToken {
        string id PK
        string userId FK
        string token
        date expiresAt
    }
```

## Entity Descriptions

- **User**: Registered users of the system (Customer, Staff, Admin).
- **Movie**: Film information including metadata and restrictions.
- **Theater**: Physical cinema locations and their layout.
- **Showtime**: A specific screening of a movie at a theater.
- **Booking**: A reservation record linking a user to a showtime and specific seats.
- **Coupon**: Discount codes that can be applied to bookings.
- **News**: Promotional content or announcements.
- **RefreshToken**: Security tokens for maintaining user sessions.
