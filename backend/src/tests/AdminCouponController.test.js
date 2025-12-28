const AdminCouponController = require('../interfaces/http/controllers/AdminCouponController');

describe('AdminCouponController', () => {
  let controller;
  let mockService;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockService = {
      createCoupon: jest.fn(),
      getCouponById: jest.fn(),
      getAllCoupons: jest.fn(),
      getCouponsWithPagination: jest.fn(),
      updateCoupon: jest.fn(),
      deleteCoupon: jest.fn()
    };
    controller = new AdminCouponController(mockService);
    mockReq = {
      body: {},
      params: {},
      query: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it('should return 201 on successful coupon creation', async () => {
    mockReq.body = { code: 'SAVE10', value: 10 };
    mockService.createCoupon.mockResolvedValue({ id: '1', ...mockReq.body });

    await controller.createCoupon(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ code: 'SAVE10' }));
  });

  it('should return 200 on getting all coupons with pagination', async () => {
    const paginatedResult = {
      coupons: [{ id: '1', code: 'A' }],
      totalCoupons: 1,
      totalPages: 1
    };
    mockService.getCouponsWithPagination.mockResolvedValue(paginatedResult);

    await controller.getAllCoupons(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith(paginatedResult);
  });

  it('should return 404 when updating non-existent coupon', async () => {
    mockReq.params.id = 'invalid';
    mockService.updateCoupon.mockResolvedValue(null);

    await controller.updateCoupon(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
  });

  it('should return 200 on successful deletion', async () => {
    mockReq.params.id = '1';
    mockService.deleteCoupon.mockResolvedValue(true);

    await controller.deleteCoupon(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String) }));
  });
});
