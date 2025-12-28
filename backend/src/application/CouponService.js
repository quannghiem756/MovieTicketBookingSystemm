const Coupon = require('../domain/Coupon');

class CouponService {
  constructor(couponRepository, bookingRepository, showtimeRepository, movieRepository) {
    this.couponRepository = couponRepository;
    this.bookingRepository = bookingRepository;
    this.showtimeRepository = showtimeRepository;
    this.movieRepository = movieRepository;
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

  async validateCoupon(code, { userId, orderTotal, movieId } = {}) {
    const coupon = await this.couponRepository.findByCode(code);
    if (!coupon) {
      throw new Error('Invalid coupon code');
    }

    const now = new Date();
    if (now < new Date(coupon.startDate)) {
      throw new Error('Coupon is not yet active');
    }
    if (now > new Date(coupon.endDate)) {
      throw new Error('Coupon has expired');
    }

    if (coupon.usageLimit !== null && coupon.currentUsage >= coupon.usageLimit) {
      throw new Error('Coupon usage limit reached');
    }

    if (userId && coupon.userUsageLimit !== null && this.bookingRepository) {
      const userUsage = await this.bookingRepository.countByUserAndCoupon(userId, code);
      if (userUsage >= coupon.userUsageLimit) {
        throw new Error('You have already used this coupon');
      }
    }

    if (orderTotal !== undefined && orderTotal < coupon.minOrderValue) {
      throw new Error(`Minimum order value of ${coupon.minOrderValue} not met`);
    }

    if (movieId && coupon.applicableMovieIds && coupon.applicableMovieIds.length > 0) {
      const isEligible = coupon.applicableMovieIds.some(id => id.toString() === movieId.toString());
      if (!isEligible) {
        throw new Error('This coupon is not valid for the selected movie');
      }
    }

    let discountAmount = 0;
    if (coupon.type === 'PERCENTAGE') {
      discountAmount = (orderTotal || 0) * (coupon.value / 100);
    } else {
      discountAmount = coupon.value;
    }

    return {
      isValid: true,
      couponId: coupon.id,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discountAmount
    };
  }
}

module.exports = CouponService;