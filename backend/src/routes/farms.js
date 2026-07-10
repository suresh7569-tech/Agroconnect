const express = require('express');
const ctrl = require('../controllers/farmController');
const { requireAuth, requireRole } = require('../middleware/auth');
const wrap = require('../utils/asyncHandler');

const router = express.Router();

router.get('/', wrap(ctrl.listFarms));
router.get('/mine', requireAuth, requireRole('farmer'), wrap(ctrl.getMyFarm));
router.get('/:id', wrap(ctrl.getFarm));
router.post('/mine', requireAuth, requireRole('farmer'), wrap(ctrl.createOrUpdateMyFarm));

module.exports = router;
