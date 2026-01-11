# Product Guide - Movie Ticket Booking System

## Initial Concept
A comprehensive Movie Ticket Booking System with a Node.js backend, React frontend, **React Native mobile application (CineBook)**, and a Python-based vector service for recommendations.

## Target Users
- **Moviegoers:** Regular customers who want to browse movies, view trailers, select seats, and book tickets seamlessly via web or mobile.
- **Cinema Administrators:** Staff responsible for managing the movie catalog, theater configurations, showtime schedules, and monitoring sales analytics.
- **On-site Staff:** Cinema personnel responsible for scanning and validating customer tickets at entry points.

## Core Goals
- **Seamless Booking Experience:** Provide a unified booking flow across web and mobile platforms (**CineBook app**), including digital ticket generation with QR codes for future kiosk integration.
- **AI-Driven Personalization:** Leverage a vector-based recommendation service to provide users with tailored movie suggestions.
- **Operational Efficiency:** Empower administrators with intuitive tools for managing complex schedules, theater layouts, and content.

## Key Features
### Customer-Facing
- **Movie Discovery:** Advanced search and browsing of movies with rich metadata (posters, trailers, release dates, and durations).
- **Home Page News Sidebar:** A dedicated sidebar on the home page displaying the latest news, promotions, and cinema updates.
- **Real-time Data Freshness:** Automatic data refresh on screen focus and manual "Pull-to-Refresh" functionality on the mobile home screen and movie details.
- **Customer Support:** A "Contact Us" form accessible from the home page for users to submit inquiries with automatic priority assignment based on category.
- **Format Filtering:** Seamlessly filter showtimes by format (e.g., 2D, 3D, IMAX) directly within movie listings.
- **Interactive Seat Selection:** A visual seat map for choosing specific seats in real-time, with a seat-hold timer to prevent indefinite locking.
- **Promotional Coupons:** Ability to apply discount codes during checkout for reduced ticket prices.
- **Email Notifications & Verification:** Automated HTML emails for booking confirmations (with scannable QR codes) and OTP-based email verification for registration and password resets, with proactive redirection and automatic OTP resend for unverified users attempting to login.
- **Secure Payments & QR Tickets:** Integration with MoMo E-Wallet for secure transactions, a dedicated mobile booking confirmation screen mirroring the web experience, and generation of digital tickets with secure QR codes for on-site validation.
- **AI Recommendation Chatbot:** An intelligent assistant for personalized movie suggestions with strict grounding to prevent hallucinations and full bilingual support (English/Vietnamese). **Accessible via a persistent Floating Action Button (FAB) on mobile.**
- **User Profiles:** Management of personal information, **Google OAuth login**, and access to a detailed booking history.
- **Secure Sessions:** Implementation of database-backed refresh tokens with rotation, concurrency-safe grace periods, and HttpOnly cookies for enhanced security and reliability.
- **Multi-language Support:** Full bilingual support (English/Vietnamese) across web and mobile, with a mandatory language selection on first mobile app launch.

### Admin Panel
- **Catalog Management:** Full CRUD operations for movies, including poster image uploads and theater configuration.
- **Scheduling & Theater Config:** Tools for defining showtimes and configuring theater seat maps.
- **Dashboard & Analytics:** Overview of bookings and sales performance.
- **User & News Management:** Administration of user accounts and publishing of cinema-related news and promotions.
- **Coupon Management:** Comprehensive tools for creating and monitoring promotional discount codes with various restrictions.
- **Support Ticket Management:** Centralized view for managing customer inquiries, sorted by oldest first with priority highlights.
- **Advanced Booking Search:** Search functionality to find bookings by user email or phone number.
- **Manual Redemption & Auditing:** Ability for staff to manually redeem tickets with mandatory confirmation and automatic audit logging for security.

## Technical Priorities
- **High Availability:** Ensuring the system remains responsive during peak booking periods for blockbuster releases.
- **Real-Time Synchronization:** Using WebSockets (Socket.io) to provide instant updates on seat availability.
- **Security & Compliance:** Implementing robust data protection for user profiles and adhering to secure payment processing standards.
- **Modular Monolith:** Maintaining a clean, modular structure within the monolith to facilitate maintenance and future scalability.
