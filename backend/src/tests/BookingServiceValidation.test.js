const BookingService = require('../application/BookingService');

describe('BookingService - validateBooking', () => {
  let bookingService;
  let mockBookingRepository;
  let mockValidationService;

  beforeEach(() => {
    mockBookingRepository = {
      findById: jest.fn(),
      update: jest.fn()
    };
    mockValidationService = {
      verifyValidationToken: jest.fn()
    };
    bookingService = new BookingService(
      mockBookingRepository,
      null, null, null, null,
      mockValidationService
    );
  });

  it('should return invalid if token verification fails', async () => {
    mockValidationService.verifyValidationToken.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const result = await bookingService.validateBooking('bad_token');

    expect(result.status).toBe('invalid');
    expect(result.message).toBe('Invalid token');
  });

  it('should return invalid if booking not found', async () => {
    mockValidationService.verifyValidationToken.mockReturnValue({ bookingId: '123' });
    mockBookingRepository.findById.mockResolvedValue(null);

    const result = await bookingService.validateBooking('valid_token');

    expect(result.status).toBe('invalid');
    expect(result.message).toBe('Booking not found');
  });

  it('should return invalid if token mismatch', async () => {
    mockValidationService.verifyValidationToken.mockReturnValue({ bookingId: '123' });
    mockBookingRepository.findById.mockResolvedValue({ 
      id: '123', 
      validationToken: 'other_token' 
    });

    const result = await bookingService.validateBooking('valid_token');

    expect(result.status).toBe('invalid');
    expect(result.message).toBe('Token mismatch');
  });

  it('should return redeemed if booking already redeemed', async () => {
    mockValidationService.verifyValidationToken.mockReturnValue({ bookingId: '123' });
    mockBookingRepository.findById.mockResolvedValue({ 
      id: '123', 
      validationToken: 'valid_token',
      status: 'redeemed',
      seatIds: ['A1']
    });

    const result = await bookingService.validateBooking('valid_token');

    expect(result.status).toBe('redeemed');
  });

  it('should return valid if booking confirmed and token matches', async () => {
    mockValidationService.verifyValidationToken.mockReturnValue({ bookingId: '123' });
    mockBookingRepository.findById.mockResolvedValue({ 
      id: '123', 
      validationToken: 'valid_token',
      status: 'confirmed',
      seatIds: ['A1'],
      totalPrice: 100
    });

    const result = await bookingService.validateBooking('valid_token');

    expect(result.status).toBe('valid');
    expect(result.booking.id).toBe('123');
  });

  it('should mark booking as redeemed on first valid scan', async () => {
    mockValidationService.verifyValidationToken.mockReturnValue({ bookingId: '123' });
    const booking = { 
      id: '123', 
      validationToken: 'valid_token',
      status: 'confirmed',
      seatIds: ['A1'],
      totalPrice: 100
    };
    mockBookingRepository.findById.mockResolvedValue(booking);
    mockBookingRepository.update.mockResolvedValue({ ...booking, status: 'redeemed' });

    const result = await bookingService.validateBooking('valid_token');

    expect(result.status).toBe('valid');
    expect(mockBookingRepository.update).toHaveBeenCalledWith('123', expect.objectContaining({ status: 'redeemed' }));
  });
});
