const BookingController = require('../interfaces/http/controllers/BookingController');
const BookingService = require('../application/BookingService');
const ValidationService = require('../application/ValidationService');
const jwt = require('jsonwebtoken');
const httpMocks = require('node-mocks-http');

describe('Validation Integration Tests', () => {
  let bookingController;
  let bookingService;
  let validationService;
  let mockBookingRepository;
  let mockShowtimeRepository;

  beforeEach(() => {
    mockBookingRepository = {
      findById: jest.fn(),
      update: jest.fn()
    };
    mockShowtimeRepository = {
        findById: jest.fn()
    };
    validationService = new ValidationService('test_secret');
    
    // Setup default valid showtime (now)
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    mockShowtimeRepository.findById.mockResolvedValue({
      id: 'showtime123',
      showDate: now,
      showTime: `${hours}:${minutes}`
    });

    bookingService = new BookingService(
      mockBookingRepository,
      null, 
      mockShowtimeRepository, // Inject mock showtime repo
      null, null,
      validationService
    );
    bookingController = new BookingController(bookingService);
  });

  it('should successfully validate and redeem a valid token', async () => {
    const bookingId = 'booking123';
    const token = validationService.generateValidationToken(bookingId);
    
    const booking = {
      id: bookingId,
      validationToken: token,
      status: 'confirmed',
      showtimeId: 'showtime123',
      seatIds: ['A1', 'A2'],
      totalPrice: 200
    };
    
    mockBookingRepository.findById.mockResolvedValue(booking);
    mockBookingRepository.update.mockResolvedValue({ ...booking, status: 'redeemed' });

    const req = httpMocks.createRequest({ method: 'GET', query: { token } });
    const res = httpMocks.createResponse();

    await bookingController.validateBooking(req, res);

    expect(res.statusCode).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.status).toBe('valid');
    expect(data.booking.id).toBe(bookingId);
    expect(mockBookingRepository.update).toHaveBeenCalledWith(bookingId, expect.objectContaining({ status: 'redeemed' }));
  });

  it('should return invalid for an expired token', async () => {
    // This tests the JWT expiration itself, independent of the window logic (if JWT expired before window check)
    // However, since verifyValidationToken throws specific error for expiration, this should still work.
    const token = jwt.sign({ bookingId: '123' }, 'test_secret', { expiresIn: '0s' });
    
    const req = httpMocks.createRequest({ method: 'GET', query: { token } });
    const res = httpMocks.createResponse();

    await bookingController.validateBooking(req, res);

    expect(res.statusCode).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.status).toBe('invalid');
    expect(data.message).toBe('Validation token expired');
  });

  it('should return HTML when requested and valid', async () => {
    const bookingId = 'booking123';
    const token = validationService.generateValidationToken(bookingId);
    
    const booking = {
      id: bookingId,
      validationToken: token,
      status: 'confirmed',
      showtimeId: 'showtime123',
      seatIds: ['A1']
    };
    
    mockBookingRepository.findById.mockResolvedValue(booking);
    mockBookingRepository.update.mockResolvedValue({ ...booking, status: 'redeemed' });

    const req = httpMocks.createRequest({ 
      method: 'GET', 
      query: { token },
      headers: { accept: 'text/html' }
    });
    const res = httpMocks.createResponse();

    await bookingController.validateBooking(req, res);

    expect(res.statusCode).toBe(200);
    const html = res._getData();
    expect(html).toContain('<div class="status">valid</div>');
  });

  it('should return redeemed status for a token already redeemed', async () => {
    const bookingId = 'booking123';
    const token = validationService.generateValidationToken(bookingId);
    
    const booking = {
      id: bookingId,
      validationToken: token,
      status: 'redeemed',
      showtimeId: 'showtime123',
      seatIds: ['A1']
    };
    
    mockBookingRepository.findById.mockResolvedValue(booking);

    const req = httpMocks.createRequest({ method: 'GET', query: { token } });
    const res = httpMocks.createResponse();

    await bookingController.validateBooking(req, res);

    expect(res.statusCode).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.status).toBe('redeemed');
  });

  it('should return invalid for token mismatch', async () => {
    const bookingId = 'booking123';
    const token = validationService.generateValidationToken(bookingId);
    
    const booking = {
      id: bookingId,
      validationToken: 'different_token',
      status: 'confirmed'
    };
    
    mockBookingRepository.findById.mockResolvedValue(booking);

    const req = httpMocks.createRequest({ method: 'GET', query: { token } });
    const res = httpMocks.createResponse();

    await bookingController.validateBooking(req, res);

    expect(res.statusCode).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.status).toBe('invalid');
    expect(data.message).toBe('Token mismatch');
  });
});