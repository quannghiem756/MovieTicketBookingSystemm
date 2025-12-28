class CouponController {
  constructor(couponService) {
    this.couponService = couponService;
  }

  async validateCoupon(req, res) {
    try {
      const { code, orderTotal, movieId } = req.body;
      const userId = req.user ? req.user.id : null;

      const result = await this.couponService.validateCoupon(code, {
        userId,
        orderTotal,
        movieId
      });

      return res.json(result);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
}

module.exports = CouponController;
