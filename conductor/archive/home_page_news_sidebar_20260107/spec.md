# Specification - Home Page News Sidebar

## Overview
Modify the Home page layout to include a news sidebar on the right side, mimicking the provided reference screenshot. This sidebar will showcase recent news, promotions, and events, allowing users to stay informed while browsing movies.

## Functional Requirements
- **Layout Modification:** Update the Home page grid to a 75/25 split. The left 75% will contain the "Now Showing" movie section, and the right 25% will host the new "News" (Tin tức) sidebar.
- **News Data Fetching:** Retrieve the 5 most recent published news items from the backend.
- **News Sidebar Components:**
    - Header: Display "Tin tức" title with a "Xem tất cả" (View All) link that redirects to the full news list page.
    - News Cards: A scrollable list of up to 5 cards.
    - Card Content: Each card must include:
        - A feature image, scaled or cropped to fit the sidebar width without overflowing.
        - The news title/headline.
        - A category tag (e.g., Promotion, Event).
- **Interactions:**
    - Clicking a news card redirects the user to the dedicated news details page (`/news/:id`).
    - Clicking "Xem tất cả" redirects to the news listing page.
- **Responsive Design:** On mobile/tablet screens where the 75/25 split is impractical, the sidebar should gracefully stack below the movie section or be hidden (standard MUI responsive behavior).

## Non-Functional Requirements
- **Visual Consistency:** Use MUI components and follow the project's Material Design theme.
- **Performance:** Ensure sidebar images are lazily loaded and appropriately sized to prevent layout shifts.

## Acceptance Criteria
- [ ] Home page layout successfully splits into 75% (Movies) and 25% (News Sidebar).
- [ ] Sidebar displays exactly 5 most recent news items (if available).
- [ ] News images are correctly contained within the sidebar width.
- [ ] Clicking a news card navigates to the correct `/news/:id` route.
- [ ] Clicking "Xem tất cả" navigates to the `/news` route.
- [ ] Sidebar stacks correctly on mobile devices.

## Out of Scope
- Implementation of the full news listing page or details page (assuming they exist or will be handled separately if missing).
- Real-time updates for news (manual refresh is acceptable).
