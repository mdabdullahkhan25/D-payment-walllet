const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// @desc    Get all transactions for a user
// @route   GET /api/transactions
// @access  Private
exports.getTransactions = async (req, res) => {
  try {
    const { type, limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    const query = { user: req.user.id };
    if (type) {
      query.type = type;
    }

    // Find transactions
    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10))
      .populate({
        path: 'recipient',
        select: 'name email'
      });

    // Get total count
    const total = await Transaction.countDocuments(query);

    res.status(200).json({
      success: true,
      count: transactions.length,
      total,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        pages: Math.ceil(total / parseInt(limit, 10))
      },
      data: transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
exports.getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate({
        path: 'user',
        select: 'name email'
      })
      .populate({
        path: 'recipient',
        select: 'name email'
      });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Make sure user owns transaction
    if (transaction.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this transaction'
      });
    }

    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get transaction summary (for dashboard)
// @route   GET /api/transactions/summary
// @access  Private
exports.getTransactionSummary = async (req, res) => {
  try {
    // Get total transactions
    const totalTransactions = await Transaction.countDocuments({
      user: req.user.id
    });

    // Get total spent (payments and transfers out)
    const totalSpent = await Transaction.aggregate([
      {
        $match: {
          user: mongoose.Types.ObjectId(req.user.id),
          amount: { $lt: 0 }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Get total received (deposits and transfers in)
    const totalReceived = await Transaction.aggregate([
      {
        $match: {
          user: mongoose.Types.ObjectId(req.user.id),
          amount: { $gt: 0 }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Get recent transactions
    const recentTransactions = await Transaction.find({
      user: req.user.id
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate({
        path: 'recipient',
        select: 'name email'
      });

    res.status(200).json({
      success: true,
      data: {
        totalTransactions,
        totalSpent: totalSpent.length > 0 ? Math.abs(totalSpent[0].total) : 0,
        totalReceived: totalReceived.length > 0 ? totalReceived[0].total : 0,
        recentTransactions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
}; 