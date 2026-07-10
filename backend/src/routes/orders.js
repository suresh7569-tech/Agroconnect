const express = require('express');
const ctrl = require('../controllers/orderController');
const { requireAuth, requireRole } = require('../middleware/auth');
const wrap = require('../utils/asyncHandler');

const router = express.Router();

router.use(requireAuth);
router.post('/', requireRole('consumer'), wrap(ctrl.createOrder));
router.get('/mine', requireRole('consumer'), wrap(ctrl.myOrders));
router.get('/farmer', requireRole('farmer'), wrap(ctrl.farmerOrders));
router.get('/:id', wrap(ctrl.getOrder));
router.patch('/:id/status', wrap(ctrl.updateStatus));

module.exports = router;
