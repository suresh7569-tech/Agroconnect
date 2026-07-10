const express = require('express');
const ctrl = require('../controllers/visitController');
const { requireAuth, requireRole } = require('../middleware/auth');
const wrap = require('../utils/asyncHandler');

const router = express.Router();

router.use(requireAuth);
router.post('/', requireRole('consumer'), wrap(ctrl.bookVisit));
router.get('/mine', requireRole('consumer'), wrap(ctrl.myVisits));
router.get('/farmer', requireRole('farmer'), wrap(ctrl.farmerVisits));
router.patch('/:id/cancel', wrap(ctrl.cancelVisit));

module.exports = router;
