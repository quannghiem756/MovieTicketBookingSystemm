# Implementation Plan: Mobile News Details Screen

## Overview
Implement a dedicated News Details screen in the mobile application to allow users to read the full content of news articles, mirroring the functionality and layout of the web version.

## Phase 1: Setup and Infrastructure [checkpoint: e2624e6]
- [x] Task: Install `react-native-render-html` and `domhandler` b3694c4
- [x] Task: Add `getNewsById` to `mobile-app/src/services/movieService.ts` d4c70f7
- [x] Task: Add news-related translations (title, categories) to `mobile-app/src/translations/en.ts` and `vi.ts` d7c0c75
- [x] Task: Define `NewsDetails` route in `mobile-app/src/navigation/AppNavigator.tsx` c054376
- [x] Task: Conductor - User Manual Verification 'Phase 1: Setup and Infrastructure' (Protocol in workflow.md) e2624e6

## Phase 2: Screen Development (TDD)
- [x] Task: Create `NewsDetailsScreen` component skeleton and tests 876d03a
- [x] Task: Implement UI layout (Image, Title, Date, Category) with tests b9dd807
- [x] Task: Implement HTML content rendering using `react-native-render-html` with tests a8dc9fd
- [x] Task: Implement loading and error states with tests 0ecdf42
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Screen Development' (Protocol in workflow.md)

## Phase 3: Integration
- [ ] Task: Update `HomeScreen.tsx` to navigate to `NewsDetailsScreen` when a news item is pressed
- [ ] Task: Verify data flow from `HomeScreen` to `NewsDetailsScreen`
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Integration' (Protocol in workflow.md)

## Phase 4: Final Polish
- [ ] Task: Final styling and responsiveness check on different screen sizes
- [ ] Task: Add JSDoc documentation for new components and services
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Final Polish' (Protocol in workflow.md)
