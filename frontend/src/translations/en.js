const en = {
  // Header
  'header.home': 'Home',
  'header.nowShowing': 'Now Showing',
  'header.comingSoon': 'Coming Soon',
  'header.myBookings': 'My Bookings',
  'header.admin': 'Admin',
  'header.logout': 'Logout',
  'header.login': 'Login',
  'header.profile': 'Profile',
  
  // Profile Page
  'profile.title': 'My Profile',
  'profile.edit': 'Edit Profile',
  'profile.save': 'Save Changes',
  'profile.cancel': 'Cancel',
  'profile.saving': 'Saving...',
  'profile.updateSuccess': 'Profile updated successfully',
  'profile.updateError': 'Failed to update profile',
  
  // Home Page
  'home.welcomeTitle': 'Welcome to MovieTicketBooking',
  'home.welcomeText': 'Book movie tickets online quickly and easily',
  'home.nowShowing': 'Now Showing',
  'home.comingSoon': 'Coming Soon',
  
  // Movie Card
  'movieCard.bookTicket': 'Book Ticket',
  'movieCard.mins': 'mins',
  
  // Now Showing Page
  'nowShowing.title': 'Now Showing Movies',
  
  // Coming Soon Page
  'comingSoon.title': 'Coming Soon Movies',
  
  // Movie Details Page
  'movieDetails.director': 'Director:',
  'movieDetails.cast': 'Cast:',
  'movieDetails.genres': 'Genres:',
  'movieDetails.synopsis': 'Synopsis',
  'movieDetails.showtimes': 'Showtimes',
  'movieDetails.noShowtimes': 'No showtimes available for this movie.',
  'movieDetails.select': 'Select',
  
  // Bookings Page
  'bookings.title': 'My Bookings',
  'bookings.bookingId': 'Booking ID:',
  'bookings.status': 'Status:',
  'bookings.totalPrice': 'Total Price:',
  'bookings.bookingDate': 'Booking Date:',
  'bookings.seats': 'Seats:',
  'bookings.noBookings': 'You have no bookings yet.',
  'bookings.status.confirmed': 'Confirmed',
  'bookings.status.pending': 'Pending',
  'bookings.status.cancelled': 'Cancelled',
  
  // Login Page
  'login.title': 'Sign in to your account',
  'login.email': 'Email address',
  'login.password': 'Password',
  'login.submit': 'Sign in',
  'login.loading': 'Signing in...',
  'login.noAccount': 'Don\'t have an account?',
  'login.register': 'Register here',
  'login.error': 'Login failed. Please try again.',
  
  // Register Page
  'register.title': 'Create a new account',
  'register.name': 'Full name',
  'register.email': 'Email address',
  'register.password': 'Password',
  'register.confirmPassword': 'Confirm password',
  'register.phone': 'Phone number',
  'register.dateOfBirth': 'Date of birth',
  'register.submit': 'Register',
  'register.loading': 'Registering...',
  'register.hasAccount': 'Already have an account?',
  'register.login': 'Sign in',
  'register.error': 'Registration failed. Please try again.',
  
  // Validation errors
  'validation.name.required': 'Name is required',
  'validation.name.minLength': 'Name must be at least 2 characters',
  'validation.name.maxLength': 'Name must be less than 50 characters',
  'validation.name.invalid': 'Name can only contain letters and spaces',
  'validation.email.required': 'Email is required',
  'validation.email.invalid': 'Please enter a valid email address',
  'validation.email.exists': 'Email already exists',
  'validation.password.required': 'Password is required',
  'validation.password.minLength': 'Password must be at least 8 characters',
  'validation.password.invalid': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  'validation.password.mismatch': 'Passwords do not match',
  'validation.phone.invalid': 'Please enter a valid phone number',
  'validation.dateOfBirth.age': 'You must be at least 13 years old',
  
  // Admin Sidebar
  'admin.sidebar.adminPanel': 'Admin Panel',
  'admin.sidebar.dashboard': 'Dashboard',
  'admin.sidebar.movies': 'Movies',
  'admin.sidebar.showtimes': 'Showtimes',
  'admin.sidebar.theaters': 'Theaters',
  'admin.sidebar.bookings': 'Bookings',
  'admin.sidebar.users': 'Users',
  
  // Admin Dashboard
  'admin.dashboard.title': 'Admin Dashboard',
  'admin.dashboard.movies': 'Movies',
  'admin.dashboard.manageMovies': 'Manage Movies',
  'admin.dashboard.showtimes': 'Showtimes',
  'admin.dashboard.manageShowtimes': 'Manage Showtimes',
  'admin.dashboard.theaters': 'Theaters',
  'admin.dashboard.manageTheaters': 'Manage Theaters',
  'admin.dashboard.bookings': 'Bookings',
  'admin.dashboard.manageBookings': 'Manage Bookings',
  'admin.dashboard.users': 'Users',
  'admin.dashboard.manageUsers': 'Manage Users',
  'admin.dashboard.recentActivity': 'Recent Activity',
  'admin.dashboard.newMovieAdded': 'New movie added',
  'admin.dashboard.showtimeCreated': 'Showtime created',
  'admin.dashboard.bookingConfirmed': 'Booking confirmed',
  
  // Admin Movies
  'admin.movies.title': 'Manage Movies',
  'admin.movies.addNew': 'Add New Movie',
  'admin.movies.table.title': 'Title',
  'admin.movies.table.director': 'Director',
  'admin.movies.table.releaseDate': 'Release Date',
  'admin.movies.table.actions': 'Actions',
  'admin.movies.edit': 'Edit',
  'admin.movies.delete': 'Delete',
  'admin.movies.deleteConfirm': 'Are you sure you want to delete this movie?',
  'admin.movies.deleteError': 'Failed to delete movie',
  'admin.movies.pagination.previous': 'Previous',
  'admin.movies.pagination.next': 'Next',
  
  // Movie Form
  'admin.movieForm.addTitle': 'Add New Movie',
  'admin.movieForm.editTitle': 'Edit Movie',
  'admin.movieForm.title': 'Title',
  'admin.movieForm.director': 'Director',
  'admin.movieForm.cast': 'Cast (comma separated)',
  'admin.movieForm.duration': 'Duration (minutes)',
  'admin.movieForm.genre': 'Genre (comma separated)',
  'admin.movieForm.rating': 'Rating',
  'admin.movieForm.releaseDate': 'Release Date',
  'admin.movieForm.endDate': 'End Date',
  'admin.movieForm.synopsis': 'Synopsis',
  'admin.movieForm.posterUrl': 'Poster URL',
  'admin.movieForm.trailerUrl': 'Trailer URL',
  'admin.movieForm.cancel': 'Cancel',
  'admin.movieForm.save': 'Save Movie',
  'admin.movieForm.saving': 'Saving...',
  'admin.movieForm.error': 'Failed to save movie:',
  // Showtime Management in Movie Form
  'admin.movieForm.showtimesTitle': 'Showtimes',
  'admin.movieForm.addShowtime': 'Add Showtime',
  'admin.movieForm.editShowtime': 'Edit Showtime',
  'admin.movieForm.showtimeDate': 'Date',
  'admin.movieForm.showtimeTime': 'Time',
  'admin.movieForm.showtimeTheater': 'Theater',
  'admin.movieForm.showtimeFormat': 'Format',
  'admin.movieForm.showtimeLanguage': 'Language',
  'admin.movieForm.showtimePrice': 'Price ($)',
  'admin.movieForm.showtimeActions': 'Actions',
  'admin.movieForm.theater': 'Theater',
  'admin.movieForm.selectTheater': 'Select a theater',
  'admin.movieForm.noShowtimes': 'No showtimes available for this movie.',
  'admin.movieForm.deleteShowtimeConfirm': 'Confirm Delete',
  'admin.movieForm.deleteShowtimeMessage': 'Are you sure you want to delete the showtime for',

  // Admin Theaters
  'admin.theaters.title': 'Manage Theaters',
  'admin.theaters.addNew': 'Add New Theater',
  'admin.theaters.table.name': 'Name',
  'admin.theaters.table.location': 'Location',
  'admin.theaters.table.totalSeats': 'Total Seats',
  'admin.theaters.table.actions': 'Actions',
  'admin.theaters.edit': 'Edit',
  'admin.theaters.delete': 'Delete',
  'admin.theaters.deleteConfirm': 'Confirm Delete',
  'admin.theaters.deleteMessage': 'Are you sure you want to delete theater',
  'admin.theaters.cancel': 'Cancel',
  'admin.theaters.deleteError': 'Failed to delete theater',

  // Theater Form
  'admin.theaterForm.addTitle': 'Add New Theater',
  'admin.theaterForm.editTitle': 'Edit Theater',
  'admin.theaterForm.name': 'Theater Name',
  'admin.theaterForm.location': 'Location',
  'admin.theaterForm.rows': 'Number of Rows',
  'admin.theaterForm.seatsPerRow': 'Seats Per Row',
  'admin.theaterForm.cancel': 'Cancel',
  'admin.theaterForm.save': 'Save Theater',
  'admin.theaterForm.saving': 'Saving...',
  'admin.theaterForm.error': 'Failed to save theater:',
  'admin.theaterForm.seatMapTitle': 'Seat Map',
  'admin.theaterForm.seatMap.row': 'Row',
  // Seat Types
  'admin.theaterForm.seatType.legend': 'Seat Types:',
  'admin.theaterForm.seatType.standard': 'Standard',
  'admin.theaterForm.seatType.premium': 'Premium',
  'admin.theaterForm.seatType.vip': 'VIP',
  
  // Pagination
  'pagination.previous': 'Previous',
  'pagination.next': 'Next',
  
  // Common
  'common.loading': 'Loading...',
  'common.error': 'An error occurred',
  'common.movieNotFound': 'Movie not found'
};

export default en;