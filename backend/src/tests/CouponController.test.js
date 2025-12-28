const CouponController = require('../interfaces/http/controllers/CouponController');

describe('CouponController', () => {
  let controller;
  let mockService;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockService = {
      validateCoupon: jest.fn()
    };
    controller = new CouponController(mockService);
    mockReq = {
      body: {},
      user: { id: 'user123' }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it('should return 200 and validation result on successful validation', async () => {
    const validationResult = {
      isValid: true,
      code: 'SAVE10',
      discountAmount: 10
    };
    mockReq.body = { code: 'SAVE10', orderTotal: 100 };
    mockService.validateCoupon.mockResolvedValue(validationResult);

    await controller.validateCoupon(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith(validationResult);
  });

  it('should return 400 when validation fails', async () => {
    mockReq.body = { code: 'EXPIRED' };
    mockService.validateCoupon.mockRejectedValue(new Error('Coupon has expired'));

    await controller.validateCoupon(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Coupon has expired' });
  });
});
