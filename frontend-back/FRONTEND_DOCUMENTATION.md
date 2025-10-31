# Movie Ticket Booking System - Frontend Documentation

## Overview
This document provides comprehensive documentation for the frontend of the Movie Ticket Booking System, a React-based web application that allows users to browse movies, view showtimes, and book tickets. The admin panel provides functionality for managing movies, showtimes, bookings, and users.

## Technology Stack
- **React** (v18+)
- **React Router** (v6+) for client-side routing
- **Axios** for API requests
- **Tailwind CSS** for styling
- **Context API** for state management

## Project Structure
```
frontend/
├── public/
├── src/
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React context providers
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   │   └── admin/        # Admin-specific pages
│   ├── services/         # API service layer
│   └── ...
├── package.json
└── ...
```

## Key Components

### Authentication
- **AuthProvider**: Context provider for managing user authentication state
- **ProtectedRoute**: Component for protecting routes that require authentication
- **AuthContext**: Context for accessing authentication state and functions

### UI Components
- **Header**: Navigation bar with links and authentication controls
- **Footer**: Site footer with additional information
- **MovieCard**: Display component for movie information
- **AdminSidebar**: Navigation sidebar for admin panel

### Pages
#### User Pages
- **Home**: Main landing page with featured movies
- **NowShowing**: List of currently showing movies
- **ComingSoon**: List of upcoming movies
- **MovieDetails**: Detailed view of a specific movie with showtime information
- **Bookings**: User's booking history
- **Login**: User authentication form
- **Register**: User registration form

#### Admin Pages
- **AdminDashboard**: Overview of system statistics and recent activity
- **AdminMovies**: Management interface for movies
- **AdminShowtimes**: Management interface for showtimes
- **AdminBookings**: Management interface for bookings
- **AdminUsers**: Management interface for users
- **MovieForm**: Form for creating/editing movies
- **ShowtimeForm**: Form for creating/editing showtimes

## API Integration
The frontend communicates with the backend API through a service layer located in `src/services/`.

### API Service (`api.js`)
Handles all HTTP requests to the backend API with automatic authentication token management.

Key features:
- Automatic inclusion of authentication tokens in requests
- Token refresh functionality for expired tokens
- Response interceptors for error handling

### Auth Service (`authService.js`)
Handles authentication-specific API calls such as login and registration.

## Authentication Flow
1. User submits login credentials through the Login page
2. Credentials are sent to the backend API via `authService.login()`
3. On successful authentication:
   - Access token and refresh token are stored in localStorage
   - User data is stored in localStorage
   - Authentication state is updated in the AuthContext
4. Protected routes check authentication state before rendering
5. API requests automatically include the access token
6. Expired tokens are automatically refreshed using the refresh token

## Routing
The application uses React Router for client-side navigation with the following main routes:

### Public Routes
- `/` - Home page
- `/now-showing` - Currently showing movies
- `/coming-soon` - Upcoming movies
- `/movie/:id` - Movie details page
- `/login` - User login
- `/register` - User registration
- `/admin/login` - Admin login

### Protected User Routes
- `/bookings` - User's booking history

### Protected Admin Routes
All admin routes are protected and require admin privileges:
- `/admin` - Admin dashboard
- `/admin/movies` - Movie management
- `/admin/movies/new` - Create new movie
- `/admin/movies/:id` - Edit movie
- `/admin/showtimes` - Showtime management
- `/admin/showtimes/new` - Create new showtime
- `/admin/showtimes/:id` - Edit showtime
- `/admin/bookings` - Booking management
- `/admin/users` - User management

## State Management
The application uses React's Context API for state management:

### AuthContext
Manages user authentication state including:
- Current user information
- Authentication status
- Loading state
- Login/logout functions

## Styling
The application uses Tailwind CSS for styling with a responsive design that works on mobile, tablet, and desktop devices.

## API Endpoints
The frontend interacts with the backend API at `http://localhost:5000/api` with the following key endpoints:

### Movies
- `GET /movies` - Get all movies
- `GET /movies/now-showing` - Get currently showing movies
- `GET /movies/coming-soon` - Get upcoming movies
- `GET /movies/:id` - Get movie by ID
- `POST /movies` - Create new movie (admin only)
- `PUT /movies/:id` - Update movie (admin only)
- `DELETE /movies/:id` - Delete movie (admin only)

### Showtimes
- `GET /showtimes/movie/:movieId` - Get showtimes for a movie
- `GET /showtimes/:id` - Get showtime by ID
- `POST /showtimes` - Create new showtime (admin only)
- `PUT /showtimes/:id` - Update showtime (admin only)
- `DELETE /showtimes/:id` - Delete showtime (admin only)

### Bookings
- `GET /bookings/user/:userId` - Get user's bookings
- `GET /bookings/:id` - Get booking by ID
- `POST /bookings` - Create new booking
- `PUT /bookings/:id/confirm` - Confirm booking (admin only)
- `PUT /bookings/:id/cancel` - Cancel booking

### Users
- `POST /users` - Register new user
- `POST /users/login` - User login
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user (admin only)

## Development Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. The application will be available at `http://localhost:3000`

## Build Process
To create a production build:
1. Navigate to the frontend directory: `cd frontend`
2. Run the build command: `npm run build`
3. The build output will be in the `build/` directory

## Testing
The application includes basic test setup with React Testing Library:
- Run tests: `npm test`
- Run tests with coverage: `npm test -- --coverage`

## Deployment
The frontend can be deployed to any static hosting service that supports client-side routing (e.g., Netlify, Vercel, Firebase Hosting). Ensure that routing fallbacks are configured to redirect all routes to `index.html`.