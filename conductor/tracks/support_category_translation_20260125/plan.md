# Implementation Plan - Support Ticket Category Translations

This plan outlines the steps to introduce Vietnamese translations for support ticket categories in the backend, specifically for email notifications sent during internal replies.

## Phase 1: Preparation & Infrastructure [checkpoint: a2a0185]

- [x] Task: Define Support Category Translations constant [aac3c9a]
    - [x] Identify a suitable location for shared constants or define within `SupportService.js`
    - [x] Add `SUPPORT_CATEGORY_TRANSLATIONS` mapping English keys to Vietnamese values
- [x] Task: Conductor - User Manual Verification 'Phase 1: Preparation & Infrastructure' (Protocol in workflow.md) a2a0185

## Phase 2: SupportService Enhancement (TDD) [checkpoint: baf0ca6]

- [x] Task: Update `addInternalReply` to support localized categories [24a675a]
    - [x] Write failing unit test in `backend/src/tests/SupportService.test.js` to verify that `emailTemplates.getSupportReplyTemplate` is called with the translated Vietnamese category
    - [x] Update `SupportService.addInternalReply` to translate the category using the map before passing it to the email template
    - [x] Verify the test passes
- [x] Task: Ensure Priority Logic remains unaffected [n/a]
    - [x] Write/Verify unit tests for `_calculatePriority` in `backend/src/tests/SupportService.test.js` using original English category keys
    - [x] Ensure `_calculatePriority` implementation still uses English keys
- [x] Task: Conductor - User Manual Verification 'Phase 2: SupportService Enhancement (TDD)' (Protocol in workflow.md) baf0ca6

## Phase 3: Final Verification & Cleanup

- [x] Task: End-to-End Manual Verification [n/a]
    - [x] Trigger an internal reply from the Admin Panel
    - [x] Verify the received email notification displays the category in Vietnamese (e.g., "Vấn đề thanh toán" instead of "Payment Issue")
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Final Verification & Cleanup' (Protocol in workflow.md)
