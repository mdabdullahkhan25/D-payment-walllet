const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc    Get user wallet
// @route   GET /api/wallet
// @access  Private
exports.getWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user.id });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    res.status(200).json({
      success: true,
      data: wallet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Add funds to wallet (via Stripe)
// @route   POST /api/wallet/add-funds
// @access  Private
exports.addFunds = async (req, res) => {
  try {
    const { amount, paymentMethodId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid amount'
      });
    }

    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe requires amount in cents
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
    });

    if (paymentIntent.status === 'succeeded') {
      // Find user wallet
      const wallet = await Wallet.findOne({ user: req.user.id });

      if (!wallet) {
        return res.status(404).json({
          success: false,
          message: 'Wallet not found'
        });
      }

      // Update wallet balance
      wallet.balance += amount;
      await wallet.save();

      // Create transaction record
      const transaction = await Transaction.create({
        user: req.user.id,
        type: 'deposit',
        amount,
        status: 'completed',
        description: 'Added funds via Stripe',
        reference: paymentIntent.id,
        paymentMethod: 'stripe'
      });

      res.status(200).json({
        success: true,
        data: {
          wallet,
          transaction
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment failed'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Transfer funds to another user
// @route   POST /api/wallet/transfer
// @access  Private
exports.transferFunds = async (req, res) => {
  try {
    const { recipientEmail, amount, description } = req.body;

    if (!recipientEmail || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a recipient email and valid amount'
      });
    }

    // Find sender wallet
    const senderWallet = await Wallet.findOne({ user: req.user.id });

    if (!senderWallet) {
      return res.status(404).json({
        success: false,
        message: 'Sender wallet not found'
      });
    }

    // Check if sender has enough balance
    if (senderWallet.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient funds'
      });
    }

    // Find recipient by email
    const User = require('../models/User');
    const recipient = await User.findOne({ email: recipientEmail });

    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found'
      });
    }

    // Find recipient wallet
    const recipientWallet = await Wallet.findOne({ user: recipient._id });

    if (!recipientWallet) {
      return res.status(404).json({
        success: false,
        message: 'Recipient wallet not found'
      });
    }

    // Update wallets
    senderWallet.balance -= amount;
    recipientWallet.balance += amount;

    await senderWallet.save();
    await recipientWallet.save();

    // Create transaction records
    const senderTransaction = await Transaction.create({
      user: req.user.id,
      type: 'transfer',
      amount: -amount,
      status: 'completed',
      description: description || 'Transfer to ' + recipient.email,
      recipient: recipient._id,
      paymentMethod: 'wallet'
    });

    const recipientTransaction = await Transaction.create({
      user: recipient._id,
      type: 'transfer',
      amount,
      status: 'completed',
      description: description || 'Transfer from ' + req.user.email,
      reference: senderTransaction._id,
      paymentMethod: 'wallet'
    });

    res.status(200).json({
      success: true,
      data: {
        senderWallet,
        transaction: senderTransaction
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

// @desc    Make a payment to a merchant
// @route   POST /api/wallet/payment
// @access  Private
exports.makePayment = async (req, res) => {
  try {
    const { merchantId, amount, description } = req.body;

    if (!merchantId || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a merchant ID and valid amount'
      });
    }

    // Find user wallet
    const wallet = await Wallet.findOne({ user: req.user.id });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    // Check if user has enough balance
    if (wallet.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient funds'
      });
    }

    // Find merchant by ID
    const User = require('../models/User');
    const merchant = await User.findById(merchantId);

    if (!merchant) {
      return res.status(404).json({
        success: false,
        message: 'Merchant not found'
      });
    }

    // Find merchant wallet
    const merchantWallet = await Wallet.findOne({ user: merchant._id });

    if (!merchantWallet) {
      return res.status(404).json({
        success: false,
        message: 'Merchant wallet not found'
      });
    }

    // Update wallets
    wallet.balance -= amount;
    merchantWallet.balance += amount;

    await wallet.save();
    await merchantWallet.save();

    // Create transaction record
    const transaction = await Transaction.create({
      user: req.user.id,
      type: 'payment',
      amount: -amount,
      status: 'completed',
      description: description || 'Payment to ' + merchant.name,
      recipient: merchant._id,
      paymentMethod: 'wallet'
    });

    const merchantTransaction = await Transaction.create({
      user: merchant._id,
      type: 'payment',
      amount,
      status: 'completed',
      description: description || 'Payment from ' + req.user.name,
      reference: transaction._id,
      paymentMethod: 'wallet'
    });

    res.status(200).json({
      success: true,
      data: {
        wallet,
        transaction
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