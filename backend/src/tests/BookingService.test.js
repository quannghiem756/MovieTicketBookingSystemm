const BookingService = require('../application/BookingService');
const User = require('../domain/User');

describe('BookingService', () => {
    let bookingService;
    let mockBookingRepository;
    let mockUserRepository;
    let mockShowtimeRepository;
    let mockMovieRepository;

    let mockCouponService;
    let mockValidationService;

    beforeEach(() => {
        mockBookingRepository = {
            findById: jest.fn(),
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
        mockCouponService = {
            validateCoupon: jest.fn(),
            incrementUsage: jest.fn(),
            decrementUsage: jest.fn()
        };
        mockValidationService = {
            generateValidationToken: jest.fn().mockReturnValue('mock-token'),
            verifyValidationToken: jest.fn()
        };

        bookingService = new BookingService(
            mockBookingRepository,
            mockUserRepository,
            mockShowtimeRepository,
            mockMovieRepository,
            mockCouponService,
            mockValidationService
        );
    });

    describe('createBooking', () => {
        it('should throw error if user is underage for the movie', async () => {
            const userId = 'user1';
            const showtimeId = 'showtime1';
            const movieId = 'movie1';

            // Mock User
            const user = new User(userId, 'Test', 'test@test.com', '123', 'hash', new Date('2015-01-01'), 0); // 10 years old (approx)
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
             mockBookingRepository.update.mockImplementation((id, data) => Promise.resolve(data));

             await expect(bookingService.createBooking(bookingData)).resolves.toBeDefined();
        });

        it('should apply coupon and update total price when couponCode is provided', async () => {
            const userId = 'user1';
            const showtimeId = 'showtime1';
            const movieId = 'movie1';

            const user = new User(userId, 'Test', 'test@test.com', '123', 'hash', new Date('2000-01-01'), 0);
            user.canBookMovie = () => true;
            mockUserRepository.findById.mockResolvedValue(user);
            mockShowtimeRepository.findById.mockResolvedValue({ id: showtimeId, movieId: movieId });
            mockMovieRepository.findById.mockResolvedValue({ id: movieId, rating: 'P' });

            const bookingData = { 
                userId, 
                showtimeId, 
                seatIds: ['A1'], 
                totalPrice: 100, 
                paymentMethod: 'cash',
                couponCode: 'SAVE10'
            };

            const validationResult = {
                isValid: true,
                code: 'SAVE10',
                discountAmount: 10
            };
            mockCouponService.validateCoupon.mockResolvedValue(validationResult);
            mockBookingRepository.create.mockImplementation(booking => Promise.resolve({ ...booking, id: 'booking1' }));
            mockBookingRepository.update.mockImplementation((id, data) => Promise.resolve(data));

            const result = await bookingService.createBooking(bookingData);

            expect(mockCouponService.validateCoupon).toHaveBeenCalledWith('SAVE10', {
                userId,
                orderTotal: 100,
                movieId
            });
            expect(mockCouponService.incrementUsage).toHaveBeenCalledWith('SAVE10');
            expect(result.totalPrice).toBe(90);
            expect(result.originalPrice).toBe(100);
            expect(result.discountAmount).toBe(10);
            expect(result.couponCode).toBe('SAVE10');
        });

        it('should throw error if coupon is invalid', async () => {
            const userId = 'user1';
            const showtimeId = 'showtime1';
            const movieId = 'movie1';

            mockUserRepository.findById.mockResolvedValue({ id: userId, canBookMovie: () => true });
            mockShowtimeRepository.findById.mockResolvedValue({ id: showtimeId, movieId: movieId });
            mockMovieRepository.findById.mockResolvedValue({ id: movieId, rating: 'P' });

            mockCouponService.validateCoupon.mockRejectedValue(new Error('Invalid coupon code'));

            const bookingData = { userId, showtimeId, seatIds: ['A1'], totalPrice: 100, couponCode: 'INVALID' };

            await expect(bookingService.createBooking(bookingData))
                .rejects
                .toThrow('Invalid coupon code');
        });

        it('should throw error if coupon usage limit is reached during increment', async () => {
            const userId = 'user1';
            const showtimeId = 'showtime1';
            const movieId = 'movie1';

            mockUserRepository.findById.mockResolvedValue({ id: userId, canBookMovie: () => true });
            mockShowtimeRepository.findById.mockResolvedValue({ id: showtimeId, movieId: movieId });
            mockMovieRepository.findById.mockResolvedValue({ id: movieId, rating: 'P' });

            mockCouponService.validateCoupon.mockResolvedValue({ isValid: true, code: 'LIMIT', discountAmount: 10 });
            mockCouponService.incrementUsage.mockRejectedValue(new Error('Coupon usage limit reached'));

            const bookingData = { userId, showtimeId, seatIds: ['A1'], totalPrice: 100, couponCode: 'LIMIT' };

            await expect(bookingService.createBooking(bookingData))
                .rejects
                .toThrow('Coupon usage limit reached');
        });

        it('should throw error if minimum order value is not met', async () => {
            const userId = 'user1';
            const showtimeId = 'showtime1';
            const movieId = 'movie1';

            mockUserRepository.findById.mockResolvedValue({ id: userId, canBookMovie: () => true });
            mockShowtimeRepository.findById.mockResolvedValue({ id: showtimeId, movieId: movieId });
            mockMovieRepository.findById.mockResolvedValue({ id: movieId, rating: 'P' });

            mockCouponService.validateCoupon.mockRejectedValue(new Error('Minimum order value of 200 not met'));

            const bookingData = { userId, showtimeId, seatIds: ['A1'], totalPrice: 100, couponCode: 'MIN200' };

            await expect(bookingService.createBooking(bookingData))
                .rejects
                .toThrow('Minimum order value of 200 not met');
        });
    });

    describe('cancelBooking', () => {
        it('should decrement coupon usage if booking has a coupon', async () => {
            const bookingId = 'booking123';
            const bookingData = {
                id: bookingId,
                couponCode: 'SAVE10',
                status: 'pending'
            };
            mockBookingRepository.findById.mockResolvedValue(bookingData);
            mockBookingRepository.update.mockResolvedValue({ ...bookingData, status: 'cancelled' });

            await bookingService.cancelBooking(bookingId);

            expect(mockCouponService.decrementUsage).toHaveBeenCalledWith('SAVE10');
            expect(mockBookingRepository.update).toHaveBeenCalledWith(bookingId, expect.objectContaining({
                status: 'cancelled'
            }));
        });
    });
});
