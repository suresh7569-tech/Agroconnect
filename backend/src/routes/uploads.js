const express = require('express');
const ctrl = require('../controllers/uploadController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/info', requireAuth, ctrl.uploadInfo);

module.exports = router;
