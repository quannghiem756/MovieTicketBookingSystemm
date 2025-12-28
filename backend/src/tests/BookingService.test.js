const BookingService = require('../application/BookingService');
const User = require('../domain/User');

describe('BookingService', () => {
    let bookingService;
    let mockBookingRepository;
    let mockUserRepository;
    let mockShowtimeRepository;
    let mockMovieRepository;

    beforeEach(() => {
        mockBookingRepository = {
            findPendingBookingByUser: jest.fn(),
            findCollidingBooking: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            addSeatToBooking: jest.fn(),
            removeSeatFromBooking: jest.fn(),
            delete: jest.fn()
        };
        mockUserRepository = {
            findById: jest.fn()
        };
        mockShowtimeRepository = {
            findById: jest.fn()
        };
        mockMovieRepository = {
            findById: jest.fn()
        };

        bookingService = new BookingService(
            mockBookingRepository,
            mockUserRepository,
            mockShowtimeRepository,
            mockMovieRepository
        );
    });

    describe('createBooking', () => {
        it('should throw error if user is underage for the movie', async () => {
            const userId = 'user1';
            const showtimeId = 'showtime1';
            const movieId = 'movie1';

            // Mock User
            const user = new User(userId, 'Test', 'test@test.com', '123', 'hash', new Date('2015-01-01'), 0); // 10 years old (approx)
            // We can override calculateAge or rely on the logic if we set correct date. 
            // Since we mocked User class in other tests by requiring it, here we are using real User class.
            // Let's rely on real logic or spy.
            user.calculateAge = () => 10;
            user.canBookMovie = (rating) => false; // Enforce failure

            mockUserRepository.findById.mockResolvedValue(user);

            // Mock Showtime
            mockShowtimeRepository.findById.mockResolvedValue({ id: showtimeId, movieId: movieId });

            // Mock Movie
            mockMovieRepository.findById.mockResolvedValue({ id: movieId, rating: 'C18' });

            const bookingData = { userId, showtimeId, seatIds: ['A1'], totalPrice: 100, paymentMethod: 'cash' };

            await expect(bookingService.createBooking(bookingData))
                .rejects
                .toThrow('User is not old enough to watch this movie (Rated C18)');
        });
        
        it('should proceed if user is old enough', async () => {
             const userId = 'user1';
            const showtimeId = 'showtime1';
            const movieId = 'movie1';

            // Mock User (18yo)
            const user = new User(userId, 'Test', 'test@test.com', '123', 'hash', new Date('2000-01-01'), 0);
            user.calculateAge = () => 25;
            user.canBookMovie = (rating) => true; // Enforce success
            mockUserRepository.findById.mockResolvedValue(user);

            // Mock Showtime
            mockShowtimeRepository.findById.mockResolvedValue({ id: showtimeId, movieId: movieId });

            // Mock Movie
            mockMovieRepository.findById.mockResolvedValue({ id: movieId, rating: 'C18' });

             const bookingData = { userId, showtimeId, seatIds: ['A1'], totalPrice: 100, paymentMethod: 'cash' };
             mockBookingRepository.findPendingBookingByUser.mockResolvedValue(null);
             mockBookingRepository.findCollidingBooking.mockResolvedValue(null);
             mockBookingRepository.create.mockResolvedValue({ id: 'booking1', status: 'confirmed' });

             await expect(bookingService.createBooking(bookingData)).resolves.toBeDefined();
        });
    });
});
