const { createMomoPaymentUrl } = require('../application/PaymentService');
const MongoBookingRepository = require('../infrastructure/repositories/MongoBookingRepository');

// Mock MongoBookingRepository
jest.mock('../infrastructure/repositories/MongoBookingRepository');

describe('PaymentService - Dynamic Redirect URL', () => {
  let mockFindById;

  beforeEach(() => {
    jest.clearAllMocks();
    mockFindById = MongoBookingRepository.prototype.findById;
    global.fetch = jest.fn();
    
    process.env.MOMO_PARTNER_CODE = 'MOMO';
    process.env.MOMO_ACCESS_KEY = 'access_key';
    process.env.MOMO_SECRET_KEY = 'secret_key';
    process.env.MOMO_REDIRECT_URL = 'http://default-redirect.com';
  });

  it('should use the custom redirectUrl if provided', async () => {
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

    const customRedirectUrl = 'exp://10.0.2.2:8081/--/payment/result';
    await createMomoPaymentUrl('booking123', customRedirectUrl);

    // Verify fetch was called with the custom redirectUrl appended as a query param
    // The base URL is MOMO_REDIRECT_URL or localhost/api/payments/momo/return
    // Since MOMO_REDIRECT_URL is set in beforeEach:
    const expectedRedirectUrl = `${process.env.MOMO_REDIRECT_URL}?clientRedirect=${encodeURIComponent(customRedirectUrl)}`;

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: expect.stringContaining(`"redirectUrl":"${expectedRedirectUrl}"`)
      })
    );
  });

  it('should fallback to default MOMO_REDIRECT_URL if no custom redirectUrl is provided', async () => {
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

    await createMomoPaymentUrl('booking123');

    // Verify fetch was called with the default redirectUrl
    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: expect.stringContaining(`"redirectUrl":"${process.env.MOMO_REDIRECT_URL}"`)
      })
    );
  });
});
