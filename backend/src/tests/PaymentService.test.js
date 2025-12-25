const { createMomoPaymentUrl } = require('../application/PaymentService');
const MongoBookingRepository = require('../infrastructure/repositories/MongoBookingRepository');

// Mock MongoBookingRepository
jest.mock('../infrastructure/repositories/MongoBookingRepository');

describe('PaymentService', () => {
  let mockFindById;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Get the mock instance methods
    mockFindById = MongoBookingRepository.prototype.findById;
    
    // Mock fetch
    global.fetch = jest.fn();
    
    // Setup environment variables
    process.env.MOMO_PARTNER_CODE = 'MOMO';
    process.env.MOMO_ACCESS_KEY = 'access_key';
    process.env.MOMO_SECRET_KEY = 'secret_key';
  });

  describe('createMomoPaymentUrl', () => {
    it('should correctly construct the request and return payUrl on success', async () => {
      const mockBooking = {
        _id: 'booking123',
        totalPrice: 100000,
        toString: () => 'booking123'
      };

      mockFindById.mockResolvedValue(mockBooking);

      global.fetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          payUrl: 'https://test-payment.momo.vn/pay?s=123',
          resultCode: 0,
          message: 'Success'
        })
      });

      const payUrl = await createMomoPaymentUrl('booking123');

      expect(payUrl).toBe('https://test-payment.momo.vn/pay?s=123');
      expect(mockFindById).toHaveBeenCalledWith('booking123');
      
      // Verify fetch was called with correct body
      expect(global.fetch).toHaveBeenCalledWith(
        'https://test-payment.momo.vn/v2/gateway/api/create',
        expect.objectContaining({
          method: 'POST',
          body: expect.any(String)
        })
      );

      const requestBody = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(requestBody.amount).toBe('100000');
      expect(requestBody.orderId).toBe('booking123');
      expect(requestBody.partnerCode).toBe('MOMO');
    });

    it('should throw an error if booking is not found', async () => {
      mockFindById.mockResolvedValue(null);

      await expect(createMomoPaymentUrl('nonexistent')).rejects.toThrow('Booking not found');
    });

    it('should throw an error if MoMo API returns an error', async () => {
      mockFindById.mockResolvedValue({
        _id: 'booking123',
        totalPrice: 100000,
        toString: () => 'booking123'
      });

      global.fetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          resultCode: 1,
          message: 'Invalid signature'
        })
      });

      await expect(createMomoPaymentUrl('booking123')).rejects.toThrow('Invalid signature');
    });
  });
});