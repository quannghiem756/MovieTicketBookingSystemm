const BookingService = require('../application/BookingService');
const ValidationService = require('../application/ValidationService');
const Booking = require('../domain/Booking');

// Mock dependencies
const mockBookingRepository = {
  findById: jest.fn(),
  update: jest.fn()
};
const mockShowtimeRepository = {
  findById: jest.fn()
};
const mockMovieRepository = {
    findById: jest.fn()
};

describe('Ticket Validation Window Logic', () => {
  let bookingService;
  let validationService;
  
  const secret = 'test_secret';
  const bookingId = 'booking-123';
  const showtimeId = 'showtime-456';
  const validToken = 'valid.jwt.token';

  beforeEach(() => {
    validationService = new ValidationService(secret);
    // Mock generate to return a long-lived token
    jest.spyOn(validationService, 'generateValidationToken').mockImplementation(() => validToken);
    jest.spyOn(validationService, 'verifyValidationToken').mockReturnValue({ bookingId });

    bookingService = new BookingService(
      mockBookingRepository,
      null, // userRepository
      mockShowtimeRepository,
      mockMovieRepository,
      null, // couponService
      validationService
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should reject validation if current time is more than 60 minutes BEFORE showtime', async () => {
    // Setup Showtime: Starts at 10:00 AM
    const showtimeDate = new Date();
    showtimeDate.setHours(10, 0, 0, 0); // Today 10:00 AM
    
    // Setup Mock Data
    mockBookingRepository.findById.mockResolvedValue({
      id: bookingId,
      showtimeId: showtimeId,
      status: 'confirmed',
      validationToken: validToken
    });
    
    mockShowtimeRepository.findById.mockResolvedValue({
      id: showtimeId,
      showDate: showtimeDate, // Assuming date object or string handling in service
      showTime: '10:00'
    });

    // Mock Current Time: 8:59 AM (61 mins before)
    const earlyTime = new Date(showtimeDate);
    earlyTime.setHours(8, 59, 0, 0);
    jest.useFakeTimers().setSystemTime(earlyTime);

    const result = await bookingService.validateBooking(validToken);

    expect(result.status).toBe('invalid');
    expect(result.message).toMatch(/valid 60 mins before/i);
  });

  it('should reject validation if current time is more than 30 minutes AFTER showtime start', async () => {
    // Setup Showtime: Starts at 10:00 AM
    const showtimeDate = new Date();
    showtimeDate.setHours(10, 0, 0, 0);
    
    // Setup Mock Data
    mockBookingRepository.findById.mockResolvedValue({
      id: bookingId,
      showtimeId: showtimeId,
      status: 'confirmed',
      validationToken: validToken
    });
    
    mockShowtimeRepository.findById.mockResolvedValue({
      id: showtimeId,
      showDate: showtimeDate,
      showTime: '10:00'
    });

    // Mock Current Time: 10:31 AM (31 mins after)
    const lateTime = new Date(showtimeDate);
    lateTime.setHours(10, 31, 0, 0);
    jest.useFakeTimers().setSystemTime(lateTime);

    const result = await bookingService.validateBooking(validToken);

    expect(result.status).toBe('invalid');
    expect(result.message).toMatch(/Ticket expired/i);
  });

  it('should accept validation if current time is within window (e.g. 15 mins before)', async () => {
    // Setup Showtime: Starts at 10:00 AM
    const showtimeDate = new Date();
    showtimeDate.setHours(10, 0, 0, 0);
    
    mockBookingRepository.findById.mockResolvedValue({
      id: bookingId,
      showtimeId: showtimeId,
      status: 'confirmed',
      validationToken: validToken,
      seatIds: ['A1'],
      totalPrice: 100
    });
    
    mockShowtimeRepository.findById.mockResolvedValue({
      id: showtimeId,
      showDate: showtimeDate,
      showTime: '10:00'
    });

    // Mock Current Time: 9:45 AM
    const validTime = new Date(showtimeDate);
    validTime.setHours(9, 45, 0, 0);
    jest.useFakeTimers().setSystemTime(validTime);

    const result = await bookingService.validateBooking(validToken);

    expect(result.status).toBe('valid');
  });

    it('should accept validation if current time is within window (e.g. 10 mins after)', async () => {
    // Setup Showtime: Starts at 10:00 AM
    const showtimeDate = new Date();
    showtimeDate.setHours(10, 0, 0, 0);
    
    mockBookingRepository.findById.mockResolvedValue({
      id: bookingId,
      showtimeId: showtimeId,
      status: 'confirmed',
      validationToken: validToken,
      seatIds: ['A1'],
      totalPrice: 100
    });
    
    mockShowtimeRepository.findById.mockResolvedValue({
      id: showtimeId,
      showDate: showtimeDate,
      showTime: '10:00'
    });

    // Mock Current Time: 10:10 AM
    const validTime = new Date(showtimeDate);
    validTime.setHours(10, 10, 0, 0);
    jest.useFakeTimers().setSystemTime(validTime);

    const result = await bookingService.validateBooking(validToken);

    expect(result.status).toBe('valid');
  });
});
