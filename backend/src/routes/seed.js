const express = require('express');
const ctrl = require('../controllers/seedController');
const wrap = require('../utils/asyncHandler');

const router = express.Router();
router.post('/demo', wrap(ctrl.seedDemo));

module.exports = router;
