# Plan - Home Page News Sidebar

This plan outlines the steps to implement a news sidebar on the home page, as specified in the [spec.md](./spec.md).

## Phase 1: Setup & Data Fetching
Establish the necessary services and translations to support the news sidebar.

- [x] Task: Add `news.viewAll` translation to `en.js` and `vi.js`.
- [x] Task: Ensure `getNews` in `frontend/src/services/api.js` is correctly handling published news. (Already exists, but verify it works as intended for the sidebar).
- [x] Task: Create a new component `SidebarNewsCard` in `frontend/src/components/SidebarNewsCard.jsx` for individual news items.
- [~] Task: Conductor - User Manual Verification 'Phase 1: Setup & Data Fetching' (Protocol in workflow.md)

## Phase 2: Sidebar Component Development
Build the `NewsSidebar` component that will be integrated into the home page.

- [x] Task: Create `NewsSidebar` component in `frontend/src/components/NewsSidebar.jsx`.
    - Implementation of the header with "Tin tức" and "Xem tất cả" link.
    - Implementation of the scrollable list container.
    - Integration of `SidebarNewsCard` with logic to fetch and display the 5 most recent news items.
    - Add Skeleton loading state for the sidebar.
- [x] Task: Write unit tests for `NewsSidebar` component.
- [~] Task: Conductor - User Manual Verification 'Phase 2: Sidebar Component Development' (Protocol in workflow.md)

## Phase 3: Home Page Integration
Update the Home page layout to accommodate the new sidebar.

- [x] Task: Modify `frontend/src/pages/Home.jsx` to use a 75/25 grid layout for the "Now Showing" section.
- [x] Task: Integrate `NewsSidebar` into the 25% column of the grid.
- [x] Task: Ensure proper spacing and alignment between the movie cards and the news sidebar.
- [~] Task: Conductor - User Manual Verification 'Phase 3: Home Page Integration' (Protocol in workflow.md)

## Phase 4: Responsive Design & Polishing
Ensure the sidebar looks great across all devices and handle edge cases.

- [ ] Task: Implement responsive behavior: stack the sidebar below movies or hide it on small screens (based on MUI breakpoints).
- [ ] Task: Verify image scaling/cropping in `SidebarNewsCard` to ensure it fits the sidebar width.
- [ ] Task: Final visual polish: match colors, fonts, and shadows with the existing theme.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Responsive Design & Polishing' (Protocol in workflow.md)
