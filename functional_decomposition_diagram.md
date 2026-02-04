# Functional Decomposition Diagram - Movie Ticket Booking System

```mermaid
graph TD
    Root[MOVIE TICKET BOOKING SYSTEM]:::root

    %% Level 1: Main Functional Modules
    Auth[Authentication & User Account]:::module
    Movie[Movie Management]:::module
    Booking[Booking & Reservation]:::module
    Cinema[Cinema & Schedule Mgmt]:::module
    Payment[Payment & Transactions]:::module
    Support[Support & Engagement]:::module
    Admin[Admin & Dashboard]:::module

    %% Horizontal connections from Root to Modules
    Root --- Auth
    Root --- Movie
    Root --- Booking
    Root --- Cinema
    Root --- Payment
    Root --- Support
    Root --- Admin

    %% Level 2: Sub-features (Chained vertically to match image style)
    
    %% Auth Column
    Auth --- A1[Login / Register]:::feature
    A1 --- A2[Forgot Password]:::feature
    A2 --- A3[Edit Profile]:::feature
    A3 --- A4[Change Password]:::feature
    A4 --- A5[Verify Email/OTP]:::feature

    %% Movie Column
    Movie --- M1[View Movie List]:::feature
    M1 --- M2[Search & Filter]:::feature
    M2 --- M3[View Details & Trailer]:::feature
    M3 --- M4[Rate & Review]:::feature
    M4 --- M5[AI Recommendations]:::feature

    %% Booking Column
    Booking --- B1[Select Seats]:::feature
    B1 --- B2[Real-time Seat Hold]:::feature
    B2 --- B3[Apply Coupons]:::feature
    B3 --- B4[Confirm Booking]:::feature
    B4 --- B5[View Booking History]:::feature

    %% Cinema & Schedule Column
    Cinema --- C1[Browse Theaters]:::feature
    C1 --- C2[View Showtimes]:::feature
    C2 --- C3[Filter by Format 2D/3D]:::feature
    C3 --- C4[Seat Layout View]:::feature

    %% Payment Column
    Payment --- P1[Process Payment MoMo/Card]:::feature
    P1 --- P2[Transaction History]:::feature
    P2 --- P3[Refund Processing]:::feature
    P3 --- P4[Invoice Generation]:::feature

    %% Support & Engagement Column
    Support --- S1[View News & Events]:::feature
    S1 --- S2[Create Support Ticket]:::feature
    S2 --- S3[AI Chatbot Support]:::feature
    S3 --- S4[Receive Notifications]:::feature

    %% Admin Column
    Admin --- AD1[Manage Movies & Formats]:::feature
    AD1 --- AD2[Manage Theaters & Halls]:::feature
    AD2 --- AD3[Manage Showtimes]:::feature
    AD3 --- AD4[Manage Users & Staff]:::feature
    AD4 --- AD5[View Statistics/Reports]:::feature

    %% Styling
    classDef root fill:#ffffff,stroke:#000000,stroke-width:2px,font-size:18px,font-weight:bold;
    classDef module fill:#ffffff,stroke:#000000,stroke-width:1px,font-weight:bold;
    classDef feature fill:#ffffff,stroke:#000000,stroke-width:1px;

    linkStyle default stroke:#000000,stroke-width:1px,fill:none;
```

## Functional Hierarchy Overview

This diagram illustrates the functional breakdown of the Movie Ticket Booking System, organized by core modules and their specific capabilities:

1.  **Authentication & User Account**: Handles user identity, security, and profile management (Login, Registration, OTP Verification).
2.  **Movie Management**: Features related to browsing the movie catalog, searching, viewing details, and interacting with movie content (Ratings, Recommendations).
3.  **Booking & Reservation**: The core workflow for users to reserve tickets, including seat selection with real-time locking and coupon application.
4.  **Cinema & Schedule Mgmt**: Allows users to find theaters and view schedules (Showtimes) filtered by movie formats.
5.  **Payment & Transactions**: Manages the financial aspect, including integration with payment gateways (MoMo), history tracking, and refunds.
6.  **Support & Engagement**: Features that keep users engaged and supported, such as News, Chatbot assistance, and Support Tickets.
7.  **Admin & Dashboard**: Back-office functions for staff/admins to manage the system's data (Movies, Schedules, Theaters) and view analytics.