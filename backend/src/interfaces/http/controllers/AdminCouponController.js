class AdminCouponController {
  constructor(couponService) {
    this.couponService = couponService;
  }

  async createCoupon(req, res) {
    try {
      const coupon = await this.couponService.createCoupon(req.body);
      res.status(201).json(coupon);
    } catch (error) {
      console.error('Create coupon error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async getCouponById(req, res) {
    try {
      const coupon = await this.couponService.getCouponById(req.params.id);
      if (!coupon) {
        return res.status(404).json({ error: 'Coupon not found' });
      }
      res.json(coupon);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllCoupons(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      
      const result = await this.couponService.getCouponsWithPagination(page, limit);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateCoupon(req, res) {
    try {
      const coupon = await this.couponService.updateCoupon(req.params.id, req.body);
      if (!coupon) {
        return res.status(404).json({ error: 'Coupon not found' });
      }
      res.json(coupon);
    } catch (error) {
      console.error('Update coupon error:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async deleteCoupon(req, res) {
    try {
      const result = await this.couponService.deleteCoupon(req.params.id);
      if (!result) {
        return res.status(404).json({ error: 'Coupon not found' });
      }
      res.json({ message: 'Coupon deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AdminCouponController;
