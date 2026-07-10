const express = require('express');
const ctrl = require('../controllers/paymentController');
const { requireAuth, requireRole } = require('../middleware/auth');
const wrap = require('../utils/asyncHandler');

const router = express.Router();

router.use(requireAuth, requireRole('consumer'));
router.post('/razorpay/order', wrap(ctrl.createRazorpayOrder));
router.post('/razorpay/verify', wrap(ctrl.verifyPayment));

module.exports = router;
