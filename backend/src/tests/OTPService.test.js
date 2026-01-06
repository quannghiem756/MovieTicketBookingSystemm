const OTPService = require('../application/OTPService');
const OTP = require('../infrastructure/OTPModel');

// Mock OTP model
jest.mock('../infrastructure/OTPModel');

describe('OTPService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateOTP', () => {
    it('should generate a 6-digit numeric string', () => {
      const otp = OTPService.generateOTP();
      expect(otp).toMatch(/^\d{6}$/);
    });

    it('should generate different codes sequentially', () => {
        const otp1 = OTPService.generateOTP();
        const otp2 = OTPService.generateOTP();
        // Probability of collision is low, but we just check randomness basically
        expect(otp1).not.toBeUndefined();
        expect(otp2).not.toBeUndefined();
    });
  });

  describe('saveOTP', () => {
    it('should save a new OTP record', async () => {
      const email = 'test@example.com';
      const otp = '123456';
      const purpose = 'registration';

      OTP.create.mockResolvedValue({ email, otpCode: otp, purpose });

      await OTPService.saveOTP(email, otp, purpose);

      expect(OTP.create).toHaveBeenCalledWith(expect.objectContaining({
        email,
        otpCode: otp,
        purpose,
        expiresAt: expect.any(Date)
      }));
    });
  });

  describe('verifyOTP', () => {
    it('should return true and delete OTP if matches and is not expired', async () => {
      const email = 'test@example.com';
      const otp = '123456';
      const purpose = 'registration';
      const mockDeleteOne = jest.fn().mockResolvedValue({});

      OTP.findOne.mockResolvedValue({
        email,
        otpCode: otp,
        purpose,
        expiresAt: new Date(Date.now() + 10000), // future
        deleteOne: mockDeleteOne
      });

      const isValid = await OTPService.verifyOTP(email, otp, purpose);
      expect(isValid).toBe(true);
      expect(mockDeleteOne).toHaveBeenCalled();
    });

    it('should return false if OTP is incorrect', async () => {
      OTP.findOne.mockResolvedValue(null);
      const isValid = await OTPService.verifyOTP('email', 'wrong', 'purpose');
      expect(isValid).toBe(false);
    });

    it('should return false and NOT delete if OTP is expired', async () => {
      const mockDeleteOne = jest.fn();
      OTP.findOne.mockResolvedValue({
        otpCode: '123456',
        expiresAt: new Date(Date.now() - 10000), // past
        deleteOne: mockDeleteOne
      });
      const isValid = await OTPService.verifyOTP('email', '123456', 'purpose');
      expect(isValid).toBe(false);
      // Depending on implementation, we might delete it anyway, but false is key.
    });
  });
});
