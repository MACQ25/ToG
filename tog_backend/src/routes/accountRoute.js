/**
 * Heavily based on
 * https://namastedev.com/blog/implementing-modular-architectures-in-node-js-backends/
 */

const express = require('express');
const router = express.Router();
const { registerAccount, loginAccount } = require('../controllers/accountController');

router.post('/register', registerAccount);
router.post('/login', loginAccount);

module.exports = router;