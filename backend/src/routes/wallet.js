const express = require('express');
const { getWallet, addFunds, transferFunds, makePayment } = require('../controllers/walletController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getWallet);
router.post('/add-funds', protect, addFunds);
router.post('/transfer', protect, transferFunds);
router.post('/payment', protect, makePayment);

module.exports = router; 