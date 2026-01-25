# Specification - Support Ticket Category Translations

## Overview
Currently, support ticket categories (e.g., "Payment Issue", "Account") are stored and displayed only in English in the backend and email notifications. This track aims to add translation context for these categories, specifically for the internal reply process and automated email notifications, ensuring a localized experience for Vietnamese users.

## Functional Requirements
- **Category Translation Mapping:** Implement a mapping of English support categories to their Vietnamese equivalents in the backend.
- **Localized Email Subject:** When an internal reply is added, the automated email notification should display the support ticket category in Vietnamese.
- **Display-only Translation:** Use translations for display purposes (emails, internal logs/messages) while maintaining the English category as the internal identifier for system logic (e.g., priority calculation, database storage).
- **Default Language:** Email notifications for support ticket replies will default to Vietnamese for the category name for now.

### Translation Map
| English (Key/Internal) | Vietnamese (Display) |
| :--- | :--- |
| `Payment Issue` | `Vấn đề thanh toán` |
| `Ticket/QR Problem` | `Vấn đề vé/QR` |
| `Account` | `Tài khoản` |
| `General Question` | `Câu hỏi chung` |

## Technical Requirements
- **Backend constant:** Define the `SUPPORT_CATEGORY_TRANSLATIONS` constant in `backend/src/application/SupportService.js` or a shared constants file.
- **Service Update:** Modify `addInternalReply` in `SupportService.js` to translate the category before passing it to the `EmailService` or `EmailTemplates`.
- **Maintain Internal Consistency:** Ensure that `SupportService._calculatePriority` continues to use English category keys to avoid breaking existing logic.

## Acceptance Criteria
- [ ] Support category translations are defined in the backend.
- [ ] Email notifications sent via `addInternalReply` use the Vietnamese translation for the "Subject" field in the email body.
- [ ] The English category remains unchanged in the database.
- [ ] Existing logic (e.g., priority assignment) continues to function correctly.

## Out of Scope
- Translating the entire support ticket system into languages other than English and Vietnamese.
- Client-side translation of categories (already handled via `I18nContext`).
- Changing the primary storage of categories in the database from English to Vietnamese.
