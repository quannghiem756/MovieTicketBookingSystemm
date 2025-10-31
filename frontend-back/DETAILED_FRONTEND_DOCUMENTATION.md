# Movie Ticket Booking System - Frontend Technical Documentation

## 1. Executive Summary

This document provides a comprehensive technical overview of the frontend implementation for the Movie Ticket Booking System. The frontend is a React-based web application that enables users to browse movies, view showtimes, and book tickets for their preferred shows. Additionally, it provides an administrative interface for managing movies, showtimes, bookings, and users.

## 2. Technology Stack and Architecture

### 2.1 Core Technologies
- **React** (v19.1.1): JavaScript library for building user interfaces
- **React Router** (v7.8.2): Declarative routing for React applications
- **Axios** (v1.11.0): Promise-based HTTP client for API communication
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Create React App**: Build toolchain for React applications

### 2.2 Application Architecture
The frontend follows a component-based architecture with clear separation of concerns:
- **Components**: Reusable UI elements (e.g., MovieCard, Header, Footer)
- **Pages**: Top-level route components that compose multiple components
- **Services**: API communication layer (api.js, authService.js)
- **Contexts**: State management using React's Context API (AuthContext)
- **Hooks**: Custom React hooks for encapsulating component logic

## 3. Project Structure

```
frontend/
├── public/
│   ├── index.html              # Main HTML template
│   └── ...
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── Header.js           # Navigation bar
│   │   ├── Footer.js           # Site footer
│   │   ├── MovieCard.js        # Movie display component
│   │   ├── ProtectedRoute.js   # Authentication guard
│   │   └── AdminSidebar.js     # Admin panel navigation
│   ├── contexts/               # React context providers
│   │   └── AuthContext.js      # Authentication state management
│   ├── hooks/                  # Custom React hooks
│   ├── pages/                  # Page-level components
│   │   ├── Home.js             # Landing page
│   │   ├── NowShowing.js       # Currently showing movies
│   │   ├── ComingSoon.js       # Upcoming movies
│   │   ├── MovieDetails.js     # Movie details and showtimes
│   │   ├── Bookings.js         # User bookings history
│   │   ├── Login.js            # User authentication
│   │   ├── Register.js         # User registration
│   │   ├── admin/              # Admin-specific pages
│   │   │   ├── AdminDashboard.js
│   │   │   ├── AdminMovies.js
│   │   │   ├── AdminShowtimes.js
│   │   │   ├── AdminBookings.js
│   │   │   ├── AdminUsers.js
│   │   │   ├── MovieForm.js
│   │   │   └── ShowtimeForm.js
│   ├── services/               # API service layer
│   │   ├── api.js              # HTTP client and endpoints
│   │   └── authService.js      # Authentication-specific API calls
│   ├── App.js                  # Main application component
│   ├── index.js                # Application entry point
│   └── ...
├── package.json                # Project dependencies and scripts
└── tailwind.config.js          # Tailwind CSS configuration
```

## 4. Authentication System

### 4.1 Authentication Flow
The authentication system implements a JWT-based authentication mechanism:
1. User submits credentials via the Login page
2. Credentials are sent to the backend via `authService.login()`
3. On successful authentication, the backend returns:
   - Access token (JWT)
   - Refresh token
   - User data (including role)
4. Tokens and user data are stored in localStorage
5. Authentication state is managed via React Context API

### 4.2 Context API Implementation
The `AuthContext` provides global authentication state:
- `user`: Current user object
- `isAuthenticated`: Boolean indicating authentication status
- `loading`: Loading state during initialization
- `login()`: Function to authenticate a user
- `logout()`: Function to terminate user session
- `refreshAccessToken()`: Function to refresh expired tokens

### 4.3 Protected Routes
The `ProtectedRoute` component guards routes that require authentication:
- Redirects unauthenticated users to the login page
- Prevents non-admin users from accessing admin routes
- Handles loading states during authentication checks

## 5. API Integration Layer

### 5.1 HTTP Client (`api.js`)
The `api.js` file configures an Axios instance with:
- Base URL set to `http://localhost:5000/api`
- Default headers for JSON content
- Request interceptor to automatically include authentication tokens
- Response interceptor to handle token refresh on 401 errors

### 5.2 API Endpoints
The service layer exposes functions for all backend endpoints:
- Movies: getMovies, getNowShowing, getComingSoon, getMovieById, createMovie, updateMovie, deleteMovie
- Showtimes: getShowtimesByMovieId, getShowtimeById, createShowtime, updateShowtime, deleteShowtime
- Bookings: getBookingsByUserId, getBookingById, createBooking, confirmBooking, cancelBooking
- Users: createUser, loginUser, getUserById, updateUser, deleteUser

### 5.3 Error Handling
The API layer implements:
- Automatic retry of requests with refreshed tokens
- Proper error propagation to UI components
- User-friendly error messages

## 6. User Interface Components

### 6.1 Header Component
The `Header` component provides site navigation:
- Links to main pages (Home, Now Showing, Coming Soon)
- Conditional links based on authentication state (My Bookings, Admin)
- Logout functionality
- Responsive design for mobile and desktop

### 6.2 Movie Card Component
The `MovieCard` component displays movie information:
- Poster image with fallback placeholder
- Movie title, rating, and duration
- "Book Ticket" button that navigates to movie details
- Hover effects for better user experience

### 6.3 Protected Route Component
The `ProtectedRoute` component ensures route security:
- Checks authentication status before rendering children
- Redirects unauthenticated users to login
- Prevents non-admin users from accessing admin routes

## 7. Page Components

### 7.1 Home Page (`Home.js`)
The landing page features:
- Welcome section with application introduction
- Grid of currently showing movies
- Grid of upcoming movies
- Loading and error states
- Responsive design for all screen sizes

### 7.2 Movie Details Page (`MovieDetails.js`)
Displays detailed information about a specific movie:
- Movie poster, title, director, cast, genres
- Synopsis with proper formatting
- List of available showtimes with date, time, format, language, and price
- "Select" button for each showtime to proceed with booking

### 7.3 User Bookings Page (`Bookings.js`)
Shows a user's booking history:
- List of past bookings with details
- Status indicators (confirmed, pending, cancelled)
- Booking date and total price
- Seat information display

### 7.4 Authentication Pages
#### Login Page (`Login.js`)
- Email and password form
- Form validation and error handling
- Loading states during authentication
- Redirect to appropriate page based on user role

#### Register Page (`Register.js`)
- Registration form with name, email, password, phone, and date of birth
- Form validation and error handling
- Loading states during registration
- Redirect to login page after successful registration

### 7.5 Admin Pages
#### Admin Dashboard (`AdminDashboard.js`)
Provides an overview of system statistics:
- Counters for movies, showtimes, bookings, and users
- Links to management pages
- Recent activity feed

#### Admin Movies (`AdminMovies.js`)
Management interface for movies:
- Paginated list of all movies
- Columns for title, director, and release date
- Edit and delete actions for each movie
- "Add New Movie" button
- Pagination controls

#### Movie Form (`MovieForm.js`)
Form for creating and editing movies:
- Fields for all movie attributes
- Validation for required fields
- Dynamic handling of cast and genre arrays
- Date pickers for release and end dates
- Responsive layout for all screen sizes

#### Admin Showtimes (`AdminShowtimes.js`)
Management interface for showtimes:
- List of all showtimes
- Information about movie, theater, date, time, format, language, and price
- Edit and delete actions
- "Add New Showtime" button

#### Showtime Form (`ShowtimeForm.js`)
Form for creating and editing showtimes:
- Dropdown for movie selection
- Fields for date, time, format, language, and price
- Validation for required fields

#### Admin Bookings (`AdminBookings.js`)
Management interface for all bookings:
- List of all bookings in the system
- Information about user, movie, showtime, and status
- Actions to confirm or cancel bookings

#### Admin Users (`AdminUsers.js`)
Management interface for users:
- List of all registered users
- Information about name, email, and registration date
- Actions to edit or delete users

## 8. State Management

### 8.1 Component-Level State
Components use React's `useState` hook for managing local state:
- Form inputs
- Loading indicators
- Error messages
- UI-specific toggles

### 8.2 Global State Management
The application uses React's Context API for global state:
- Authentication state (user, isAuthenticated)
- Loading states during initialization
- Error states for authentication operations

## 9. Styling and User Experience

### 9.1 Tailwind CSS
The application uses Tailwind CSS for styling with:
- Responsive utility classes
- Consistent color palette
- Spacing and typography system
- Component-specific styling

### 9.2 Responsive Design
The frontend implements responsive design principles:
- Mobile-first approach
- Flexible grid layouts
- Adaptive component sizing
- Touch-friendly navigation

### 9.3 User Experience Features
- Loading indicators for API requests
- Error messages for failed operations
- Confirmation dialogs for destructive actions
- Intuitive navigation between pages
- Form validation and user feedback

## 10. Development Environment

### 10.1 Setup Instructions
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. Access the application at `http://localhost:3000`

### 10.2 Available Scripts
- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App (irreversible)

### 10.3 Project Dependencies
Key dependencies include:
- React and ReactDOM for UI rendering
- React Router for client-side routing
- Axios for HTTP requests
- Tailwind CSS for styling
- Testing libraries for quality assurance

## 11. Production Deployment

### 11.1 Build Process
To create a production-ready build:
1. Run `npm run build` in the frontend directory
2. The optimized build will be output to the `build/` folder
3. The build includes minified JavaScript, CSS, and HTML files

### 11.2 Deployment Considerations
- Configure web server to redirect all routes to `index.html` for client-side routing
- Set appropriate cache headers for static assets
- Ensure HTTPS is used in production
- Configure environment variables for different deployment environments

## 12. Testing

### 12.1 Test Setup
The application includes a basic testing setup with:
- React Testing Library for component testing
- Jest for test execution
- Sample tests in `App.test.js`

### 12.2 Testing Commands
- `npm test`: Run tests in interactive watch mode
- `npm test -- --coverage`: Run tests with coverage report

## 13. Performance Considerations

### 13.1 Optimization Techniques
- Code splitting through React's lazy loading
- Memoization of expensive calculations
- Efficient rendering with React's virtual DOM
- Proper use of keys in list rendering

### 13.2 Bundle Analysis
- Use `npm run build` to analyze bundle size
- Consider code splitting for large components
- Optimize images and static assets

## 14. Security Considerations

### 14.1 Frontend Security
- Secure storage of authentication tokens in localStorage
- Protection against XSS through proper data handling
- Input validation on forms
- Secure routing with authentication guards

### 14.2 Communication Security
- All API communication should use HTTPS in production
- Proper handling of CORS policies
- Secure token refresh mechanism

## 15. Future Enhancements

### 15.1 Planned Features
- Advanced seat selection interface
- Payment integration
- Email notifications
- User profile management
- Movie search and filtering
- Advanced admin analytics dashboard

### 15.2 Technical Improvements
- Implementation of React hooks for complex state management
- Integration of state management libraries like Redux for larger applications
- Server-side rendering for improved SEO
- Progressive Web App features for offline functionality
- Comprehensive end-to-end testing

## 16. Conclusion

The Movie Ticket Booking System frontend provides a comprehensive solution for both users and administrators. Built with modern React practices and a clean component architecture, the application offers a responsive, accessible, and maintainable codebase. The clear separation of concerns between components, services, and state management makes it easy to extend and modify. The integration with the backend API through a well-structured service layer ensures reliable data flow and proper error handling.