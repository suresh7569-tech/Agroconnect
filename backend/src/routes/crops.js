const express = require('express');
const ctrl = require('../controllers/cropController');
const { requireAuth, requireRole } = require('../middleware/auth');
const wrap = require('../utils/asyncHandler');

const router = express.Router();

router.get('/', wrap(ctrl.listCrops));
router.get('/mine', requireAuth, requireRole('farmer'), wrap(ctrl.myCrops));
router.get('/:id', wrap(ctrl.getCrop));
router.post('/', requireAuth, requireRole('farmer'), wrap(ctrl.createCrop));
router.patch('/:id', requireAuth, requireRole('farmer'), wrap(ctrl.updateCrop));
router.delete('/:id', requireAuth, requireRole('farmer'), wrap(ctrl.deleteCrop));

module.exports = router;
