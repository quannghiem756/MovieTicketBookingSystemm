const MongoCouponRepository = require('../infrastructure/repositories/MongoCouponRepository');
const CouponModel = require('../infrastructure/CouponModel');

// Mock CouponModel
jest.mock('../infrastructure/CouponModel');

describe('MongoCouponRepository', () => {
  let repository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new MongoCouponRepository();
  });

  describe('create', () => {
    it('should save a new coupon', async () => {
      const couponData = {
        code: 'SAVE10',
        type: 'PERCENTAGE',
        value: 10,
        startDate: new Date(),
        endDate: new Date()
      };
      
      const mockSavedCoupon = {
        _id: 'coupon123',
        ...couponData,
        toObject: () => ({ _id: 'coupon123', ...couponData })
      };

      // Mock constructor and save
      CouponModel.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(mockSavedCoupon)
      }));

      const result = await repository.create(couponData);

      expect(result.id).toBe('coupon123');
      expect(result.code).toBe('SAVE10');
      expect(CouponModel).toHaveBeenCalledWith(expect.objectContaining(couponData));
    });
  });

  describe('findByCode', () => {
    it('should find a coupon by code', async () => {
      const mockCoupon = {
        _id: 'coupon123',
        code: 'SAVE10',
        type: 'PERCENTAGE',
        value: 10
      };

      CouponModel.findOne.mockResolvedValue(mockCoupon);

      const result = await repository.findByCode('SAVE10');

      expect(result.id).toBe('coupon123');
      expect(result.code).toBe('SAVE10');
      expect(CouponModel.findOne).toHaveBeenCalledWith({ code: 'SAVE10' });
    });

    it('should return null if not found', async () => {
      CouponModel.findOne.mockResolvedValue(null);
      const result = await repository.findByCode('INVALID');
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should find a coupon by id', async () => {
      const mockCoupon = { _id: 'c1', code: 'A' };
      CouponModel.findById.mockResolvedValue(mockCoupon);
      const result = await repository.findById('c1');
      expect(result.id).toBe('c1');
    });
  });

  describe('findAll', () => {
    it('should return all coupons', async () => {
      const mockCoupons = [
        { _id: 'c1', code: 'A' },
        { _id: 'c2', code: 'B' }
      ];
      const mockFind = {
        sort: jest.fn().mockResolvedValue(mockCoupons)
      };
      CouponModel.find.mockReturnValue(mockFind);

      const result = await repository.findAll();
      expect(result).toHaveLength(2);
      expect(result[0].code).toBe('A');
    });
  });

  describe('update', () => {
    it('should update a coupon', async () => {
      const mockUpdated = { _id: 'c1', code: 'A', value: 20 };
      CouponModel.findByIdAndUpdate.mockResolvedValue(mockUpdated);

      const result = await repository.update('c1', { value: 20 });
      expect(result.value).toBe(20);
      expect(CouponModel.findByIdAndUpdate).toHaveBeenCalledWith('c1', { value: 20 }, { new: true });
    });
  });

  describe('delete', () => {
    it('should delete a coupon', async () => {
      CouponModel.findByIdAndDelete.mockResolvedValue({ _id: 'c1' });
      const result = await repository.delete('c1');
      expect(result).toBe(true);
    });
  });

  describe('incrementUsage', () => {
    it('should increment coupon usage', async () => {
      const mockCoupon = { _id: 'c1', currentUsage: 4, usageLimit: 10 };
      const mockUpdated = { _id: 'c1', currentUsage: 5, usageLimit: 10 };
      
      CouponModel.findById.mockResolvedValue(mockCoupon);
      CouponModel.findOneAndUpdate.mockResolvedValue(mockUpdated);

      const result = await repository.incrementUsage('c1');
      expect(result.currentUsage).toBe(5);
      expect(CouponModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: 'c1', currentUsage: { $lt: 10 } },
        { $inc: { currentUsage: 1 } },
        { new: true }
      );
    });

    it('should throw error if usage limit reached', async () => {
      const mockCoupon = { _id: 'c1', currentUsage: 10, usageLimit: 10 };
      
      CouponModel.findById.mockResolvedValue(mockCoupon);
      CouponModel.findOneAndUpdate.mockResolvedValue(null);

      await expect(repository.incrementUsage('c1')).rejects.toThrow('Coupon usage limit reached');
    });
  });

  describe('decrementUsage', () => {
    it('should decrement coupon usage', async () => {
      const mockUpdated = { _id: 'c1', currentUsage: 4 };
      CouponModel.findOneAndUpdate.mockResolvedValue(mockUpdated);

      const result = await repository.decrementUsage('c1');
      expect(result.currentUsage).toBe(4);
      expect(CouponModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: 'c1', currentUsage: { $gt: 0 } },
        { $inc: { currentUsage: -1 } },
        { new: true }
      );
    });
  });
});
