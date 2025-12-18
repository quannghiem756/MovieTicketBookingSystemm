class DashboardService {
  constructor(movieRepository, showtimeRepository, bookingRepository, userRepository) {
    this.movieRepository = movieRepository;
    this.showtimeRepository = showtimeRepository;
    this.bookingRepository = bookingRepository;
    this.userRepository = userRepository;
  }

  async getStats() {
    try {
      // Get counts for each entity
      const movies = await this.movieRepository.countAll();
      const showtimes = await this.showtimeRepository.countAll();
      const bookings = await this.bookingRepository.countAll();
      const users = await this.userRepository.countAll();
      
      // Get revenue - sum of confirmed bookings total price
      const revenue = await this.bookingRepository.getTotalRevenue();
      
      // Get active bookings (confirmed or paid)
      const activeBookings = await this.bookingRepository.countByStatus(['confirmed', 'paid']);
      
      // Get upcoming shows (showtimes in the future)
      const upcomingShows = await this.showtimeRepository.countUpcoming();
      
      return {
        movies,
        showtimes,
        bookings,
        users,
        revenue,
        activeBookings,
        upcomingShows
      };
    } catch (error) {
      throw new Error(`Error retrieving dashboard stats: ${error.message}`);
    }
  }

  async getRecentActivity() {
    try {
      // This function will get recent activity by checking booking creation date, movie creation date, etc.
      const recentBookings = await this.bookingRepository.findAllRecent(4);
      const recentMovies = await this.movieRepository.findAllRecent(4);
      const recentShowtimes = await this.showtimeRepository.findAllRecent(4);

      // Combine and sort activities by date (most recent first)
      const activities = [];

      // Add booking activities
      recentBookings.forEach(booking => {
        if (booking.createdAt) {
          let activityTitle = 'bookingConfirmed';
          let activityColor = 'info';

          if (booking.status === 'cancelled') {
            activityTitle = 'bookingCancelled';
            activityColor = 'warning';
          } else if (booking.status === 'pending') {
            activityTitle = 'bookingCreated';
            activityColor = 'primary';
          }

          let activityDescription = '';

          if (booking.status === 'cancelled') {
            activityDescription = `Booking #${booking.id.substring(0, 6)}... for ${booking.movie?.title || 'movie'} was cancelled`;
          } else if (booking.status === 'pending') {
            activityDescription = `New booking #${booking.id.substring(0, 6)}... for ${booking.movie?.title || 'movie'} was created`;
          } else {
            activityDescription = `Booking #${booking.id.substring(0, 6)}... for ${booking.movie?.title || 'movie'} was confirmed`;
          }

          activities.push({
            id: booking.id,
            icon: 'booking',
            title: activityTitle,
            description: activityDescription,
            time: this.formatTimeAgo(new Date(booking.createdAt)),
            color: activityColor,
            status: booking.status, // Include status for frontend icon mapping
            createdAt: new Date(booking.createdAt)
          });
        }
      });

      // Add movie activities
      recentMovies.forEach(movie => {
        if (movie.createdAt) {
          activities.push({
            id: `movie-${movie.id}`,
            icon: 'movie',
            title: 'newMovieAdded',
            description: `"${movie.title}" was added to the movie list`,
            time: this.formatTimeAgo(new Date(movie.createdAt)),
            color: 'primary',
            createdAt: new Date(movie.createdAt)
          });
        }
      });

      // Add showtime activities
      recentShowtimes.forEach(showtime => {
        if (showtime.createdAt) {
          activities.push({
            id: `showtime-${showtime.id}`,
            icon: 'showtime',
            title: 'showtimeCreated',
            description: `New showtime for "${showtime.movie?.title || 'movie'}" at ${showtime.showTime}`,
            time: this.formatTimeAgo(new Date(showtime.createdAt)),
            color: 'success',
            createdAt: new Date(showtime.createdAt)
          });
        }
      });

      // Sort by most recent and take top 4
      return activities
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 4);
    } catch (error) {
      throw new Error(`Error retrieving recent activities: ${error.message}`);
    }
  }

  formatTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    }
  }

  async getPerformanceStats() {
    try {
      // Calculate booking rate (percentage of confirmed bookings vs total bookings)
      const totalBookings = await this.bookingRepository.countAll();
      const confirmedBookings = await this.bookingRepository.countByStatus(['confirmed', 'paid']);
      const bookingRate = totalBookings > 0 ? Math.round((confirmedBookings / totalBookings) * 100) : 0;

      // Calculate cinema capacity usage (based on booked seats vs total seats)
      // This is slightly more complex as we need to aggregate across all showtimes
      // For now, we'll calculate an average based on recent bookings
      const totalCapacity = await this.calculateAverageCinemaCapacity();
      const bookedSeats = await this.calculateBookedSeats();
      const cinemaCapacity = totalCapacity > 0 ? Math.round((bookedSeats / totalCapacity) * 100) : 0;

      // Default customer satisfaction to high (92%) as this would typically come from reviews
      const customerSatisfaction = 92;

      return {
        bookingRate,
        cinemaCapacity,
        customerSatisfaction
      };
    } catch (error) {
      throw new Error(`Error retrieving performance stats: ${error.message}`);
    }
  }

  // Helper method to calculate average cinema capacity
  async calculateAverageCinemaCapacity() {
    // In a real implementation, this would calculate based on all theaters
    // For now, we'll use a simple approximation based on showtimes
    const showtimes = await this.showtimeRepository.findAll();
    if (showtimes.length === 0) return 0;

    // Calculate total theoretical capacity across all showtimes
    // This is a simplified calculation - in reality you'd need to join with theaters to get totalSeats
    return showtimes.length * 100; // Assuming average theater size of 100 seats
  }

  // Helper method to calculate booked seats
  async calculateBookedSeats() {
    // Get all confirmed bookings and count their seat IDs
    const allBookings = await this.bookingRepository.findAll();
    const confirmedBookings = allBookings.filter(booking => booking.status === 'confirmed' || booking.status === 'paid');

    let totalBookedSeats = 0;
    confirmedBookings.forEach(booking => {
      totalBookedSeats += booking.seatIds.length;
    });

    return totalBookedSeats;
  }
}

module.exports = DashboardService;