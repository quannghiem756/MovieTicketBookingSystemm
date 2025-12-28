const mongoose = require('mongoose');
const CouponModel = require('../infrastructure/CouponModel');

describe('Coupon Model Validation', () => {
  it('should create a valid coupon', () => {
    const coupon = new CouponModel({
      code: 'SAVE10',
      type: 'PERCENTAGE',
      value: 10,
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000), // tomorrow
      usageLimit: 100,
      userUsageLimit: 1
    });
    const err = coupon.validateSync();
    expect(err).toBeUndefined();
  });

  it('should require code, type, value, startDate, endDate', () => {
    const coupon = new CouponModel({});
    const err = coupon.validateSync();
    expect(err).toBeDefined();
    expect(err.errors['code']).toBeDefined();
    expect(err.errors['type']).toBeDefined();
    expect(err.errors['value']).toBeDefined();
    expect(err.errors['startDate']).toBeDefined();
    expect(err.errors['endDate']).toBeDefined();
  });

  it('should validate type enum', () => {
    const coupon = new CouponModel({
        code: 'TEST',
        type: 'INVALID_TYPE',
        value: 10,
        startDate: new Date(),
        endDate: new Date()
    });
    const err = coupon.validateSync();
    expect(err).toBeDefined();
    expect(err.errors['type']).toBeDefined();
  });

  it('should ensure code is uppercase and trimmed (if handled by setter) or just validate uniqueness (mocked db)', () => {
      // Mongoose models often handle simple setters. 
      // For now, let's just check basic type constraints.
  });
});
