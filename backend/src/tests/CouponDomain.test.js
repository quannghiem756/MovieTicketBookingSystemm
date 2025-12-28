const Coupon = require('../domain/Coupon');
const CouponRepository = require('../domain/CouponRepository');

describe('Coupon Domain', () => {
  it('should instantiate Coupon entity', () => {
    const coupon = new Coupon(
        '123', 'SAVE10', 'PERCENTAGE', 10, new Date(), new Date(), 100, 1, 0, [], 0
    );
    expect(coupon.id).toBe('123');
    expect(coupon.code).toBe('SAVE10');
  });

  it('should instantiate CouponRepository interface', () => {
    const repo = new CouponRepository();
    expect(repo.create).toBeDefined();
    expect(repo.findByCode).toBeDefined();
  });
});
