# Specification: Mobile App Copy (Customer Phase)

## Overview
Develop a cross-platform mobile application for the Movie Ticket Booking System using **React Native and Expo**. This track focuses on delivering a full-featured customer experience that mirrors the existing web application while optimizing for native mobile interactions.

## Functional Requirements
### 1. Movie Discovery & Metadata
- Browse "Now Showing" and "Coming Soon" movies.
- Detailed movie pages including trailers, posters, and full metadata.
- Search functionality with filtering by format (2D, 3D, IMAX).
- "Zero Results" banner suggesting AI Chatbot for recommendations.

### 2. Booking Workflow
- Interactive seat selection optimized for touch screens.
- Real-time seat status updates via WebSockets.
- MoMo E-Wallet integration for payments.
- Generation of digital tickets with secure QR codes for on-site validation.

### 3. AI Recommendation Chatbot
- Accessible via a persistent Floating Action Button (FAB) with a unique icon on Home and Discovery screens.
- Chat interface opens in a slide-up modal or full-screen overlay.
- Full bilingual support (English/Vietnamese) with grounded recommendations.

### 4. User Accounts & Security
- User registration, login, and profile management.
- **Hybrid Authentication:** Update backend to support Bearer Tokens for mobile (stored in `SecureStore`) while maintaining HttpOnly cookies for web.
- Integration of Google OAuth login.
- Access to booking history and digital ticket storage.

### 5. News & Promotions
- Dedicated section for cinema news and promotions.
- Support for applying discount coupons during checkout.

## Non-Functional Requirements
- **Mobile-First UX:** Utilize bottom navigation tabs and native mobile gestures.
- **Brand Consistency:** Maintain the visual identity, theme, and color scheme of the existing web application.
- **Offline Awareness:** Graceful handling of network loss during critical flows (e.g., displaying already downloaded tickets).

## Out of Scope (Initial Phase)
- Staff and Admin Dashboard capabilities (to be added in a subsequent track).
- Native Push Notifications (unless requested later).
- Offline booking.

## Acceptance Criteria
- [ ] Users can successfully register and login via email or Google OAuth.
- [ ] Users can browse the movie catalog and view full details.
- [ ] A complete booking (seat selection -> payment -> QR ticket) can be performed.
- [ ] The AI Chatbot is accessible via FAB and provides grounded movie recommendations.
- [ ] The app follows a native mobile navigation pattern (Bottom Tabs).
