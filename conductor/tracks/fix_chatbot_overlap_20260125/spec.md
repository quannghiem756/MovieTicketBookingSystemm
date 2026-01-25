# Specification: Fix Chatbot Button Overlapping Navigation Bar

## 1. Overview
The Floating Action Button (FAB) for the chatbot on the mobile app is currently overlapping with the bottom navigation bar. This positional conflict hinders user interaction with both the chatbot button and the navigation controls. This track aims to resolve this UI bug by repositioning the FAB to a non-obstructive location.

## 2. Problem Statement
The chatbot FAB is positioned incorrectly on screens that feature a bottom navigation bar. Its current placement causes it to visually cover navigation items, making it difficult for users to access core features of the app and the chatbot itself. The issue is confirmed to occur on all screens where the bottom navigation bar is present.

## 3. Desired Outcome
The chatbot FAB should be relocated to a position where it remains easily accessible but does not interfere with any elements of the bottom navigation bar. The button should remain a FAB, simply adjusted to respect the layout boundaries of the navigation bar.

## 4. Functional Requirements
- The chatbot button MUST be implemented as a Floating Action Button (FAB).
- The FAB's vertical position MUST be adjusted to sit safely above the bottom navigation bar.
- The repositioning MUST be applied consistently across all screens in the mobile app that display the bottom navigation bar.
- The FAB's core functionality (opening the chatbot) MUST remain unchanged.

## 5. Non-Functional Requirements
- The change should not negatively impact the rendering performance or cause layout shifts on any screen.
- The solution must be responsive and work correctly across various device sizes and screen resolutions supported by the app.

## 6. Acceptance Criteria
- **Given** a user is on any screen with a bottom navigation bar (e.g., Home Screen, Movie Details),
- **When** the screen is rendered,
- **Then** the chatbot FAB is displayed clearly above the bottom navigation bar, without any visual overlap.
- **And** the user can successfully tap the chatbot FAB to open the chat interface.
- **And** the user can successfully tap all items within the bottom navigation bar without any interference from the FAB.
