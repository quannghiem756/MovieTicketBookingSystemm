# Specification: Auth System Upgrade (Refresh Tokens & Google OAuth)

## Overview
1.  **Refresh Token System:** Store refresh tokens in MongoDB, implement strict rotation, and deliver via `HttpOnly` cookies.
2.  **Google OAuth:** Integrate Google Sign-In to allow users to authenticate via Google, including automatic account creation for new users.

## Functional Requirements
- **Database Storage:** `RefreshToken` model to store user ID, token, and expiry.
- **Strict Rotation:** Invalidate old refresh token and issue a new one on every refresh.
- **HttpOnly Cookies:** Deliver refresh tokens via secure cookies (`HttpOnly`, `SameSite: Strict`).
- **Google OAuth Integration:**
    - **Auto-Registration:** If a Google user doesn't exist, create a new record in the `User` collection.
    - **Frontend:** Integrate Google Sign-In button (using Google Identity Services).
    - **Backend:** Endpoint to verify Google ID Tokens from the frontend.
- **Unified Token Issuance:** Both standard login and Google login must issue the same Refresh Token (Cookie) + Access Token (JSON) pair.

## Acceptance Criteria
- [ ] Users can log in via email/password or Google.
- [ ] **New users** are automatically registered when signing in with Google for the first time.
- [ ] Refresh tokens are stored in the database and rotated successfully.
- [ ] Refresh tokens are NOT accessible via `document.cookie` in the browser.
- [ ] Logging out clears the database record and the browser cookie.
