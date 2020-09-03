const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

const verifyPassword = require('../middleware/verify-pass.js');
const disableCache = require('../middleware/disable-cache');

router.post('/signup', verifyPassword, disableCache, userCtrl.signup);
router.post('/login', disableCache, userCtrl.login);

module.exports = router;