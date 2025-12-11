# Functional Decomposition Diagram - Movie Ticket Booking System

```mermaid
graph TB
    subgraph "Frontend Client"
        A[Web/Mobile UI]
    end
    
    subgraph "Backend Services"
        B[User Service]
        C[Movie Service]
        D[Theater Service]
        E[Showtime Service]
        F[Booking Service]
        G[Payment Service]
        H[Recommendation Service]
    end
    
    subgraph "Authentication & Authorization"
        I[Auth Service]
    end
    
    subgraph "Infrastructure Services"
        J[MongoDB Repositories]
        K[ChromaDB Vector Store]
        L[External APIs]
    end
    
    subgraph "Controllers Layer"
        M[User Controller]
        N[Movie Controller]
        O[Theater Controller]
        P[Showtime Controller]
        Q[Booking Controller]
        R[Payment Controller]
        S[Recommendation Controller]
    end
    
    subgraph "Application Services Layer"
        T[User Service App]
        U[Movie Service App]
        V[Theater Service App]
        W[Showtime Service App]
        X[Booking Service App]
        Y[Payment Service App]
        Z[Recommendation Service App]
    end
    
    subgraph "Domain Models & Repositories"
        AA[User Domain]
        BB[Movie Domain]
        CC[Theater Domain]
        DD[Showtime Domain]
        EE[Booking Domain]
        FF[Payment Logic]
        GG[MongoUser Repo]
        HH[MongoMovie Repo]
        II[MongoTheater Repo]
        JJ[MongoShowtime Repo]
        KK[MongoBooking Repo]
        LL[Vector Service]
    end
    
    subgraph "External Systems"
        MM[MoMo Payment API]
        NN[Movie APIs]
    end
    
    A -- "Register/Login/Profile requests" --> B
    A -- "Get/Find movies" --> C
    A -- "Get/Find theaters" --> D
    A -- "Get/Find showtimes" --> E
    A -- "Create/View bookings" --> F
    A -- "Payment requests" --> G
    A -- "Recommendation requests" --> H
    
    A -- "Authentication tokens" --> I
    
    B -- "Validate/Manage user data" --> M
    C -- "Validate/Manage movie data" --> N
    D -- "Validate/Manage theater data" --> O
    E -- "Validate/Manage showtime data" --> P
    F -- "Validate/Manage booking data" --> Q
    G -- "Process payments" --> R
    H -- "Generate recommendations" --> S
    
    M -- "Business logic" --> T
    N -- "Business logic" --> U
    O -- "Business logic" --> V
    P -- "Business logic" --> W
    Q -- "Business logic" --> X
    R -- "Business logic" --> Y
    S -- "Business logic" --> Z
    
    T -- "Domain validation" --> AA
    U -- "Domain validation" --> BB
    V -- "Domain validation" --> CC
    W -- "Domain validation" --> DD
    X -- "Domain validation" --> EE
    Y -- "Domain validation" --> FF
    Z -- "Domain validation" --> LL
    
    AA -- "Persist user data" --> GG
    BB -- "Persist movie data" --> HH
    CC -- "Persist theater data" --> II
    DD -- "Persist showtime data" --> JJ
    EE -- "Persist booking data" --> KK
    
    GG -- "MongoDB Storage" --> J
    HH -- "MongoDB Storage" --> J
    II -- "MongoDB Storage" --> J
    JJ -- "MongoDB Storage" --> J
    KK -- "MongoDB Storage" --> J
    
    Z -- "Query vectors" --> K
    K -- "Vector similarity" --> LL
    LL -- "Fetch movie data" --> NN
    
    Y -- "Process payment" --> MM
    
    style A fill:#e1f5fe
    style Backend fill:#f3e5f5
    style Infrastructure fill:#e8f5e8
    style External fill:#fff3e0
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