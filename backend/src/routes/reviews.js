const express = require('express');
const ctrl = require('../controllers/reviewController');
const { requireAuth, requireRole } = require('../middleware/auth');
const wrap = require('../utils/asyncHandler');

const router = express.Router();

router.get('/farm/:farmId', wrap(ctrl.listByFarm));
router.post('/', requireAuth, requireRole('consumer'), wrap(ctrl.createReview));

module.exports = router;
