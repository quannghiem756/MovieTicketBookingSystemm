const CouponService = require('../application/CouponService');
const Coupon = require('../domain/Coupon');

describe('CouponService', () => {
  let service;
  let mockRepo;
  let mockBookingRepo;
  let mockShowtimeRepo;
  let mockMovieRepo;

  beforeEach(() => {
    mockRepo = {
      create: jest.fn(),
      findByCode: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };
    mockBookingRepo = {
      countByUserAndCoupon: jest.fn()
    };
    mockShowtimeRepo = {
        findById: jest.fn()
    };
    mockMovieRepo = {
        findById: jest.fn()
    };
    service = new CouponService(mockRepo, mockBookingRepo, mockShowtimeRepo, mockMovieRepo);
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

  describe('validateCoupon', () => {
    const validCoupon = {
      id: '1',
      code: 'SAVE10',
      type: 'PERCENTAGE',
      value: 10,
      startDate: new Date(Date.now() - 3600000), // 1 hour ago
      endDate: new Date(Date.now() + 3600000), // 1 hour later
      usageLimit: 100,
      currentUsage: 0,
      userUsageLimit: 1,
      minOrderValue: 50,
      applicableMovieIds: []
    };

    it('should return valid if all conditions are met', async () => {
      mockRepo.findByCode.mockResolvedValue(validCoupon);
      mockBookingRepo.countByUserAndCoupon.mockResolvedValue(0);
      
      const result = await service.validateCoupon('SAVE10', { 
          userId: 'user1', 
          orderTotal: 100 
      });

      expect(result.isValid).toBe(true);
      expect(result.discountAmount).toBe(10); // 10% of 100
    });

    it('should throw error if user limit reached', async () => {
        mockRepo.findByCode.mockResolvedValue(validCoupon);
        mockBookingRepo.countByUserAndCoupon.mockResolvedValue(1);
        
        await expect(service.validateCoupon('SAVE10', { userId: 'user1' }))
          .rejects.toThrow('You have already used this coupon');
    });

    it('should throw error if movie not eligible', async () => {
        const movieRestricted = { ...validCoupon, applicableMovieIds: ['movie1'] };
        mockRepo.findByCode.mockResolvedValue(movieRestricted);
        
        await expect(service.validateCoupon('SAVE10', { movieId: 'movie2' }))
          .rejects.toThrow('This coupon is not valid for the selected movie');
    });

    it('should throw error if coupon not found', async () => {
      mockRepo.findByCode.mockResolvedValue(null);
      await expect(service.validateCoupon('INVALID'))
        .rejects.toThrow('Invalid coupon code');
    });

    it('should throw error if expired', async () => {
      const expired = { ...validCoupon, endDate: new Date(Date.now() - 1000) };
      mockRepo.findByCode.mockResolvedValue(expired);
      await expect(service.validateCoupon('SAVE10'))
        .rejects.toThrow('Coupon has expired');
    });

    it('should throw error if global limit reached', async () => {
        const full = { ...validCoupon, usageLimit: 10, currentUsage: 10 };
        mockRepo.findByCode.mockResolvedValue(full);
        await expect(service.validateCoupon('SAVE10'))
          .rejects.toThrow('Coupon usage limit reached');
    });

    it('should throw error if order value too low', async () => {
        mockRepo.findByCode.mockResolvedValue(validCoupon);
        await expect(service.validateCoupon('SAVE10', { orderTotal: 30 }))
          .rejects.toThrow('Minimum order value of 50 not met');
    });
  });
});