const express = require('express');
const ctrl = require('../controllers/adminController');
const { requireAuth, requireRole } = require('../middleware/auth');
const wrap = require('../utils/asyncHandler');

const router = express.Router();

router.use(requireAuth, requireRole('admin'));

router.get('/stats', wrap(ctrl.dashboardStats));
router.get('/farmers/pending', wrap(ctrl.pendingFarmers));
router.post('/farmers/:id/approve', wrap(ctrl.approveFarmer));
router.post('/farmers/:id/reject', wrap(ctrl.rejectFarmer));

router.get('/crops/pending', wrap(ctrl.pendingCrops));
router.post('/crops/:id/approve', wrap(ctrl.approveCrop));
router.post('/crops/:id/reject', wrap(ctrl.rejectCrop));
router.post('/crops', wrap(ctrl.adminCreateCrop));

router.get('/users', wrap(ctrl.listUsers));
router.patch('/users/:id/active', wrap(ctrl.setUserActive));

module.exports = router;
