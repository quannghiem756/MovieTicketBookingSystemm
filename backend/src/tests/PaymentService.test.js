const { createMomoPaymentUrl, verifyMomoResponse, processPaymentResult } = require('../application/PaymentService');
const MongoBookingRepository = require('../infrastructure/repositories/MongoBookingRepository');
const crypto = require('crypto');

// Mock MongoBookingRepository
jest.mock('../infrastructure/repositories/MongoBookingRepository');

describe('PaymentService', () => {
  let mockFindById;
  let mockUpdate;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Get the mock instance methods
    mockFindById = MongoBookingRepository.prototype.findById;
    mockUpdate = MongoBookingRepository.prototype.update;
    
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

  describe('verifyMomoResponse', () => {
    it('should return true for a valid signature', () => {
      const momoResponse = {
        partnerCode: 'MOMO',
        orderId: 'booking123',
        requestId: 'request123',
        amount: '100000',
        orderInfo: 'payment info',
        orderType: 'momo_wallet',
        transId: 'trans123',
        message: 'Success',
        responseTime: '2025-12-25',
        resultCode: '0',
        extraData: '',
      };

      const accessKey = 'access_key';
      const secretKey = 'secret_key';
      const rawSignature = `accessKey=${accessKey}&amount=${momoResponse.amount}&extraData=${momoResponse.extraData}&message=${momoResponse.message}&orderId=${momoResponse.orderId}&orderInfo=${momoResponse.orderInfo}&orderType=${momoResponse.orderType}&partnerCode=${momoResponse.partnerCode}&requestId=${momoResponse.requestId}&responseTime=${momoResponse.responseTime}&resultCode=${momoResponse.resultCode}&transId=${momoResponse.transId}`;
      
      const signature = crypto.createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');
      
      momoResponse.signature = signature;

      const isValid = verifyMomoResponse(momoResponse);
      expect(isValid).toBe(true);
    });

    it('should return false for an invalid signature', () => {
      const momoResponse = {
        partnerCode: 'MOMO',
        orderId: 'booking123',
        signature: 'invalid_signature'
      };

      const isValid = verifyMomoResponse(momoResponse);
      expect(isValid).toBe(false);
    });
  });

  describe('processPaymentResult', () => {
    it('should update booking to confirmed when resultCode is 0', async () => {
      const momoResponse = {
        orderId: 'booking123',
        resultCode: 0,
        transId: 'momo_trans_123'
      };

      const mockBooking = {
        _id: 'booking123',
        status: 'pending'
      };

      mockFindById.mockResolvedValue(mockBooking);

      const result = await processPaymentResult(momoResponse);

      expect(result.success).toBe(true);
      expect(mockFindById).toHaveBeenCalledWith('booking123');
      expect(mockUpdate).toHaveBeenCalledWith('booking123', expect.objectContaining({
        status: 'confirmed',
        paymentId: 'momo_trans_123'
      }));
    });

    it('should update booking to cancelled when resultCode is not 0', async () => {
      const momoResponse = {
        orderId: 'booking123',
        resultCode: 1006, // Transaction denied by user
        message: 'Transaction denied'
      };

      const mockBooking = {
        _id: 'booking123',
        status: 'pending'
      };

      mockFindById.mockResolvedValue(mockBooking);

      const result = await processPaymentResult(momoResponse);

      expect(result.success).toBe(false);
      expect(mockUpdate).toHaveBeenCalledWith('booking123', expect.objectContaining({
        status: 'cancelled'
      }));
    });

    it('should return alreadyProcessed when booking is already confirmed', async () => {
      const momoResponse = {
        orderId: 'booking123',
        resultCode: 0,
        transId: 'momo_trans_123'
      };

      const mockBooking = {
        _id: 'booking123',
        status: 'confirmed'
      };

      mockFindById.mockResolvedValue(mockBooking);

      const result = await processPaymentResult(momoResponse);

      expect(result.success).toBe(true);
      expect(result.alreadyProcessed).toBe(true);
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it('should throw error if booking not found', async () => {
      mockFindById.mockResolvedValue(null);

      await expect(processPaymentResult({ orderId: 'invalid' }))
        .rejects.toThrow('Booking not found');
    });
  });
});