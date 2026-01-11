# Implementation Plan: Mobile Home Screen Data Refreshing

## Phase 1: Research and Infrastructure Setup [checkpoint: 7c814b2]
- [x] Task: Analyze current data fetching in `HomeScreen.tsx`.
- [x] Task: Verify availability of `useFocusEffect` from `@react-navigation/native` and `RefreshControl` from `react-native`.
- [x] Task: Create unit tests for initial state verification.
- [x] Task: Conductor - User Manual Verification 'Research and Infrastructure Setup' (Protocol in workflow.md)

## Phase 2: Auto-Refresh on Focus [checkpoint: 03d4db9]
- [x] Task: Fix image URL handling for '/uploads' path to use backend API URL in `HomeScreen.tsx`.
- [x] Task: Implement `useFocusEffect` in `HomeScreen.tsx` to trigger data fetching for movies and news when the screen gains focus.
- [x] Task: Fix image URL handling for '/uploads' path to use backend API URL in `MovieDetailsScreen.tsx`.
- [x] Task: Implement `useFocusEffect` in `MovieDetailsScreen.tsx` to trigger data fetching for movies and news when the screen gains focus.
- [x] Task: Conductor - User Manual Verification 'Auto-Refresh on Focus' (Protocol in workflow.md)

## Phase 3: Pull-to-Refresh [checkpoint: 73b0982]
- [x] Task: Integrate `RefreshControl` into the `HomeScreen.tsx` ScrollView.
- [x] Task: Create an `onRefresh` handler in `HomeScreen.tsx` that manages the loading state and re-fetches movies and news.
- [x] Task: Integrate `RefreshControl` into the `MovieDetailsScreen.tsx` ScrollView.
- [x] Task: Create an `onRefresh` handler in `MovieDetailsScreen.tsx` that re-fetches movie details and showtimes.
- [x] Task: Write unit tests to verify the manual pull-to-refresh interaction and spinner behavior in `HomeScreen`.
- [x] Task: Conductor - User Manual Verification 'Pull-to-Refresh' (Protocol in workflow.md)

## Phase 4: Integration and Error Handling
- [x] Task: Ensure silent failure handling is implemented in both refresh mechanisms (Focus & Pull).
- [x] Task: Verify that the `refreshing` state is correctly reset even if API calls fail.
- [x] Task: Perform final integration testing across both mechanisms.
- [x] Task: Conductor - User Manual Verification 'Integration and Error Handling' (Protocol in workflow.md)
