# Specification: Mobile News Details Screen

## Overview
Implement a dedicated News Details screen in the mobile application to allow users to read the full content of news articles, mirroring the functionality and layout of the web version.

## Functional Requirements
- **Content Display**:
    - Display news title, publication date, and category tag.
    - Show the featured image at the top of the article.
    - Render the full article content supporting HTML formatting (bold, italics, lists, etc.) and embedded images.
- **Navigation**:
    - Integrate a standard "Back" button in the header to return to the News list or previous screen.
- **Data Integration**:
    - Fetch news data from the backend using the news ID.
    - Properly resolve image URLs (prefixing with the API base URL if necessary).
- **UI/UX**:
    - Show category tags (e.g., "Promotion", "News").
    - Hide administrative status chips (e.g., "Draft", "Expired") from regular users.
    - Implement loading indicators and error messages for a smooth user experience.

## Technical Requirements
- **HTML Rendering**: Use `react-native-render-html` to display the news content.
- **Styling**: Maintain consistency with the mobile app's theme and the web version's readability.

## Acceptance Criteria
- [ ] Tapping a news item in the mobile app navigates to the News Details screen.
- [ ] The screen correctly displays all article details (Title, Date, Category, Image, Content).
- [ ] Rich text and images within the content are rendered correctly.
- [ ] The "Back" button successfully returns the user to the previous screen.
- [ ] Loading and error states are handled gracefully.

## Out of Scope
- Editing or deleting news articles from the mobile app (Administrative functions).
- Social media sharing (can be added in a future track).
