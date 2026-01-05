# Product Guide - Movie Ticket Booking System

## Initial Concept
A comprehensive Movie Ticket Booking System with a Node.js backend, React frontend, and a Python-based vector service for recommendations.

## Target Users
- **Moviegoers:** Regular customers who want to browse movies, view trailers, select seats, and book tickets seamlessly via web or mobile.
- **Cinema Administrators:** Staff responsible for managing the movie catalog, theater configurations, showtime schedules, and monitoring sales analytics.
- **On-site Staff:** Cinema personnel responsible for scanning and validating customer tickets at entry points.

## Core Goals
- **Seamless Booking Experience:** Provide a unified booking flow across web and mobile platforms, including digital ticket generation with QR codes for future kiosk integration.
- **AI-Driven Personalization:** Leverage a vector-based recommendation service to provide users with tailored movie suggestions.
- **Operational Efficiency:** Empower administrators with intuitive tools for managing complex schedules, theater layouts, and content.

## Key Features
### Customer-Facing
- **Movie Discovery:** Advanced search and browsing of movies with rich metadata (posters, trailers, release dates, and durations).
- **Format Filtering:** Seamlessly filter showtimes by format (e.g., 2D, 3D, IMAX) directly within movie listings.
- **Interactive Seat Selection:** A visual seat map for choosing specific seats in real-time.
- **Promotional Coupons:** Ability to apply discount codes during checkout for reduced ticket prices.
- **Secure Payments & QR Tickets:** Integration with MoMo E-Wallet for secure transactions and generation of digital tickets with secure QR codes for on-site validation.
- **AI Recommendation Chatbot:** An intelligent assistant for personalized movie suggestions with strict grounding to prevent hallucinations and full bilingual support (English/Vietnamese).
- **User Profiles:** Management of personal information, **Google OAuth login**, and access to a detailed booking history.
- **Secure Sessions:** Implementation of database-backed refresh tokens with rotation and HttpOnly cookies for enhanced security.

### Admin Panel
- **Catalog Management:** Full CRUD operations for movies, including poster image uploads and theater configuration.
- **Scheduling & Theater Config:** Tools for defining showtimes and configuring theater seat maps.
- **Dashboard & Analytics:** Overview of bookings and sales performance.
- **User & News Management:** Administration of user accounts and publishing of cinema-related news and promotions.
- **Coupon Management:** Comprehensive tools for creating and monitoring promotional discount codes with various restrictions.

## Technical Priorities
- **High Availability:** Ensuring the system remains responsive during peak booking periods for blockbuster releases.
- **Real-Time Synchronization:** Using WebSockets (Socket.io) to provide instant updates on seat availability.
- **Security & Compliance:** Implementing robust data protection for user profiles and adhering to secure payment processing standards.
- **Modular Monolith:** Maintaining a clean, modular structure within the monolith to facilitate maintenance and future scalability.
