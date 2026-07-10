const express = require('express');
const {
  registerConsumer,
  registerFarmer,
  sendOtp,
  verifyOtpAndLogin,
  login,
  me,
} = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const router = express.Router();

router.post('/register/consumer', asyncHandler(registerConsumer));
router.post('/register/farmer', asyncHandler(registerFarmer));
router.post('/otp/send', asyncHandler(sendOtp));
router.post('/otp/verify', asyncHandler(verifyOtpAndLogin));
router.post('/login', asyncHandler(login));
router.get('/me', asyncHandler(requireAuth), asyncHandler(me));

module.exports = router;
