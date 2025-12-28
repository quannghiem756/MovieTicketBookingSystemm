const CouponService = require('../application/CouponService');
const Coupon = require('../domain/Coupon');

describe('CouponService', () => {
  let service;
  let mockRepo;

  beforeEach(() => {
    mockRepo = {
      create: jest.fn(),
      findByCode: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };
    service = new CouponService(mockRepo);
  });

  it('should create a coupon', async () => {
    const couponData = { code: 'SAVE10', type: 'PERCENTAGE', value: 10 };
    mockRepo.create.mockResolvedValue({ id: '1', ...couponData });

    const result = await service.createCoupon(couponData);

    expect(result.id).toBe('1');
    expect(mockRepo.create).toHaveBeenCalled();
  });

  it('should get all coupons', async () => {
    const mockCoupons = [{ id: '1', code: 'A' }, { id: '2', code: 'B' }];
    mockRepo.findAll.mockResolvedValue(mockCoupons);

    const result = await service.getAllCoupons();

    expect(result).toHaveLength(2);
    expect(mockRepo.findAll).toHaveBeenCalled();
  });

  it('should update a coupon', async () => {
    const couponData = { code: 'SAVE20', value: 20 };
    mockRepo.findById.mockResolvedValue({ id: '1', code: 'SAVE10', value: 10 });
    mockRepo.update.mockResolvedValue({ id: '1', ...couponData });

    const result = await service.updateCoupon('1', couponData);

    expect(result.value).toBe(20);
    expect(mockRepo.update).toHaveBeenCalledWith('1', expect.any(Object));
  });

  it('should delete a coupon', async () => {
    mockRepo.delete.mockResolvedValue(true);
    const result = await service.deleteCoupon('1');
    expect(result).toBe(true);
    expect(mockRepo.delete).toHaveBeenCalledWith('1');
  });
});
