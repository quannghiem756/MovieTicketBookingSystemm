const BookingController = require('../interfaces/http/controllers/BookingController');
const httpMocks = require('node-mocks-http');

describe('BookingController - validateBooking', () => {
  let bookingController;
  let mockBookingService;

  beforeEach(() => {
    mockBookingService = {
      validateBooking: jest.fn()
    };
    bookingController = new BookingController(mockBookingService);
  });

  it('should return 400 if token is missing', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      query: {}
    });
    const res = httpMocks.createResponse();

    await bookingController.validateBooking(req, res);

    expect(res.statusCode).toBe(400);
    const data = JSON.parse(res._getData());
    expect(data.error).toBe('Token is required');
  });

  it('should return 200 and validation result when token is provided', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      query: { token: 'some_token' }
    });
    const res = httpMocks.createResponse();

    const validationResult = {
      status: 'valid',
      booking: { id: 'booking123' }
    };

    mockBookingService.validateBooking.mockResolvedValue(validationResult);

    await bookingController.validateBooking(req, res);

    expect(res.statusCode).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data).toEqual(validationResult);
  });
});
