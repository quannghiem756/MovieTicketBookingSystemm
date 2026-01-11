# Functional Decomposition Diagram - Movie Ticket Booking System

```mermaid
graph TB
    subgraph "Client Layer"
        UI[Web & Mobile UI]
    end

    subgraph "API Gateway / Auth"
        Auth[Auth Service]
    end

    subgraph "Feature Modules"
        User[User Management]
        Movie[Movie Management]
        Theater[Theater Management]
        Showtime[Showtime Management]
        Booking[Booking Management]
        Payment[Payment Processing]
        Rec[Recommendation Engine]
    end

    subgraph "Data & Infrastructure"
        DB[(MongoDB)]
        VectorDB[(ChromaDB)]
    end

    subgraph "External Integrations"
        MoMo[MoMo Payment API]
        ExtMovie[External Movie APIs]
    end

    %% Client Interactions
    UI -->|Auth & Tokens| Auth
    UI -->|User Actions| User
    UI -->|Browse Movies| Movie
    UI -->|View Theaters| Theater
    UI -->|Check Showtimes| Showtime
    UI -->|Book Tickets| Booking
    UI -->|Pay| Payment
    UI -->|Get Recommendations| Rec

    %% Feature Dependencies
    Booking -->|Verify| User
    Booking -->|Verify| Showtime
    Payment -->|Process| Booking
    Rec -->|Analyze| User
    Rec -->|Analyze| Movie

    %% Data Access
    User --> DB
    Movie --> DB
    Theater --> DB
    Showtime --> DB
    Booking --> DB
    Payment --> DB

    %% Vector Search
    Rec --> VectorDB
    Movie --> VectorDB

    %% External Calls
    Payment --> MoMo
    Movie --> ExtMovie

    %% Styling
    classDef client fill:#e3f2fd,stroke:#1565c0,stroke-width:2px;
    classDef auth fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px;
    classDef feature fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px;
    classDef infra fill:#fff3e0,stroke:#ef6c00,stroke-width:2px;
    classDef ext fill:#eceff1,stroke:#455a64,stroke-width:2px;

    class UI client;
    class Auth auth;
    class User,Movie,Theater,Showtime,Booking,Payment,Rec feature;
    class DB,VectorDB infra;
    class MoMo,ExtMovie ext;
```

## System Architecture Overview

This functional decomposition diagram shows the layered architecture of the Movie Ticket Booking System:

1. **Frontend Client Layer**: The UI layer that interacts with users
2. **Backend Services Layer**: Core business services handling different domains (user, movie, theater, showtime, booking, payment)
3. **Authentication & Authorization**: Security services managing user access
4. **Controllers Layer**: Handles HTTP requests and validation
5. **Application Services Layer**: Contains business logic implementations
6. **Domain Models & Repositories**: Core business entities and data access logic
7. **Infrastructure Services**: Database storage and external services
8. **External Systems**: Third-party integrations like MoMo payment API

The diagram illustrates the flow of data and control between these various components, showing how the system handles user registration, movie browsing, theater selection, showtime scheduling, booking creation, and payment processing.
