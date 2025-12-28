const Coupon = require('../domain/Coupon');

class CouponService {
  constructor(couponRepository) {
    this.couponRepository = couponRepository;
  }

  async createCoupon(couponData) {
    const coupon = new Coupon(
      null,
      couponData.code,
      couponData.type,
      couponData.value,
      couponData.startDate,
      couponData.endDate,
      couponData.usageLimit,
      couponData.userUsageLimit,
      couponData.minOrderValue,
      couponData.applicableMovieIds,
      0 // currentUsage
    );
    return await this.couponRepository.create(coupon);
  }

  async getCouponById(id) {
    return await this.couponRepository.findById(id);
  }

  async getCouponByCode(code) {
    return await this.couponRepository.findByCode(code);
  }

  async getAllCoupons() {
    return await this.couponRepository.findAll();
  }

  async updateCoupon(id, couponData) {
    const existingCoupon = await this.couponRepository.findById(id);
    if (!existingCoupon) return null;

    const coupon = new Coupon(
      id,
      couponData.code || existingCoupon.code,
      couponData.type || existingCoupon.type,
      couponData.value !== undefined ? couponData.value : existingCoupon.value,
      couponData.startDate || existingCoupon.startDate,
      couponData.endDate || existingCoupon.endDate,
      couponData.usageLimit !== undefined ? couponData.usageLimit : existingCoupon.usageLimit,
      couponData.userUsageLimit !== undefined ? couponData.userUsageLimit : existingCoupon.userUsageLimit,
      couponData.minOrderValue !== undefined ? couponData.minOrderValue : existingCoupon.minOrderValue,
      couponData.applicableMovieIds || existingCoupon.applicableMovieIds,
      existingCoupon.currentUsage
    );

    return await this.couponRepository.update(id, coupon);
  }

  async deleteCoupon(id) {
    return await this.couponRepository.delete(id);
  }
}

module.exports = CouponService;
