const CouponRepository = require('../../domain/CouponRepository');
const CouponModel = require('../CouponModel');

class MongoCouponRepository extends CouponRepository {
  async create(coupon) {
    const couponData = {
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      startDate: coupon.startDate,
      endDate: coupon.endDate,
      usageLimit: coupon.usageLimit,
      userUsageLimit: coupon.userUsageLimit,
      minOrderValue: coupon.minOrderValue,
      applicableMovieIds: coupon.applicableMovieIds,
      currentUsage: coupon.currentUsage
    };

    const couponDoc = new CouponModel(couponData);
    const savedCoupon = await couponDoc.save();
    return this._mapToDomain(savedCoupon);
  }

  async findByCode(code) {
    const couponDoc = await CouponModel.findOne({ code });
    if (!couponDoc) return null;
    return this._mapToDomain(couponDoc);
  }

  async findById(id) {
    const couponDoc = await CouponModel.findById(id);
    if (!couponDoc) return null;
    return this._mapToDomain(couponDoc);
  }

  async findAll() {
    const couponDocs = await CouponModel.find().sort({ createdAt: -1 });
    return couponDocs.map(doc => this._mapToDomain(doc));
  }

  async update(id, couponData) {
    const updatedCoupon = await CouponModel.findByIdAndUpdate(
      id,
      couponData,
      { new: true }
    );
    if (!updatedCoupon) return null;
    return this._mapToDomain(updatedCoupon);
  }

  async delete(id) {
    const result = await CouponModel.findByIdAndDelete(id);
    return result !== null;
  }

  async incrementUsage(id) {
    const updatedCoupon = await CouponModel.findByIdAndUpdate(
      id,
      { $inc: { currentUsage: 1 } },
      { new: true }
    );
    if (!updatedCoupon) return null;
    return this._mapToDomain(updatedCoupon);
  }

  _mapToDomain(doc) {
    return {
      id: doc._id.toString(),
      code: doc.code,
      type: doc.type,
      value: doc.value,
      startDate: doc.startDate,
      endDate: doc.endDate,
      usageLimit: doc.usageLimit,
      userUsageLimit: doc.userUsageLimit,
      minOrderValue: doc.minOrderValue,
      applicableMovieIds: doc.applicableMovieIds,
      currentUsage: doc.currentUsage
    };
  }
}

module.exports = MongoCouponRepository;
