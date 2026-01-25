# Track Specification: Mobile Translation Completion

## Overview
This track aims to achieve 100% translation coverage in the CineBook mobile application. We will identify all hardcoded strings across the UI and logic, migrate them to the localization system (`i18n-js`), and provide high-quality English and Vietnamese translations.

## Functional Requirements
- **Comprehensive Identification:** Scan all `.tsx` and `.ts` files in `mobile-app/src` for hardcoded strings that should be localized.
- **I18n Integration:** Replace hardcoded strings with `t('key')` calls using the `useTranslation` hook.
- **Localization Expansion:** Update `mobile-app/src/translations/en.ts` and `mobile-app/src/translations/vi.ts` with the new keys and their respective translations.
- **Context-Aware Translation:** Ensure translations are culturally appropriate and fit within the Material Design UI constraints (React Native Paper).

## Scope of Work (Iterative by Feature)
1.  **Authentication:** Login, Register, OTP, Password Reset.
2.  **Movie & Discovery:** Movie lists, filters, details, search.
3.  **Booking Workflow:** Seat map, coupons, payment redirects.
4.  **User Domain:** Profile, booking history, settings.
5.  **Support & News:** Contact Us, support tickets, news details.
6.  **AI Chatbot:** System messages and interface elements.
7.  **General UI:** Modals, error messages, placeholders, and alerts.

## Acceptance Criteria
- No visible hardcoded strings in the UI when switching between English and Vietnamese.
- All new translation keys follow a consistent naming convention (e.g., `feature.component.key`).
- Automated tests (if applicable) verify that the translation hook is called correctly.
- The app remains functional with no broken layouts due to longer translated strings.

## Out of Scope
- Backend error message localization (unless they are explicitly handled and mapped in the mobile app).
- Localization of content from the CMS/Database (Movies, News, etc.) as these are handled by the data services.
