const express = require('express');
const AdminCouponController = require('../controllers/AdminCouponController');
const CouponController = require('../controllers/CouponController');
const MongoCouponRepository = require('../../../infrastructure/repositories/MongoCouponRepository');
const MongoBookingRepository = require('../../../infrastructure/repositories/MongoBookingRepository');
const CouponService = require('../../../application/CouponService');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

// Initialize service and controller
const couponRepository = new MongoCouponRepository();
const bookingRepository = new MongoBookingRepository();
const couponService = new CouponService(couponRepository, bookingRepository);
const adminCouponController = new AdminCouponController(couponService);
const couponController = new CouponController(couponService);

const router = express.Router();

// Public/Authenticated routes
router.post('/validate', authenticate, (req, res) => couponController.validateCoupon(req, res));

// Protected routes (admin only)
router.get('/', authenticate, authorizeAdmin, (req, res) => adminCouponController.getAllCoupons(req, res));
router.get('/:id', authenticate, authorizeAdmin, (req, res) => adminCouponController.getCouponById(req, res));
router.post('/', authenticate, authorizeAdmin, (req, res) => adminCouponController.createCoupon(req, res));
router.put('/:id', authenticate, authorizeAdmin, (req, res) => adminCouponController.updateCoupon(req, res));
router.delete('/:id', authenticate, authorizeAdmin, (req, res) => adminCouponController.deleteCoupon(req, res));

module.exports = router;
