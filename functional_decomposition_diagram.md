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

This functional decomposition diagram shows the modular architecture of the Movie Ticket Booking System:

1.  **Client Layer**: The Web & Mobile UI that interacts with users.
2.  **API Gateway / Auth**: Handles authentication and serves as the entry point for requests.
3.  **Feature Modules**: Encapsulated business logic for key domains:
    *   **User Management**: Profiles and preferences.
    *   **Movie Management**: Movie catalog and details.
    *   **Theater Management**: Theater locations and halls.
    *   **Showtime Management**: Scheduling of movies.
    *   **Booking Management**: Ticket reservation and purchase flow.
    *   **Payment Processing**: Payment transactions.
    *   **Recommendation Engine**: Personalized movie suggestions.
4.  **Data & Infrastructure**:
    *   **MongoDB**: Primary transactional database.
    *   **ChromaDB**: Vector database for recommendations.
5.  **External Integrations**: Third-party services like MoMo Payment and External Movie APIs.

The diagram illustrates the high-level interactions between the client, the consolidated feature modules, and the supporting infrastructure, emphasizing a modular and service-oriented design.
