const express = require('express');
const { getTransactions, getTransaction, getTransactionSummary } = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getTransactions);
router.get('/summary', protect, getTransactionSummary);
router.get('/:id', protect, getTransaction);

module.exports = router; 