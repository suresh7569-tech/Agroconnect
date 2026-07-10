const crypto = require('crypto');
const Order = require('../models/Order');

const isRealRazorpay = () => !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

exports.createRazorpayOrder = async (req, res) => {
  const { amount, receipt } = req.body || {};
  if (!amount || amount < 1) return res.status(400).json({ error: 'amount is required' });

  if (!isRealRazorpay()) {
    return res.json({
      mock: true,
      id: 'mock_order_' + crypto.randomBytes(6).toString('hex'),
      amount: amount * 100,
      currency: 'INR',
      receipt: receipt || null,
      keyId: 'mock_key',
    });
  }

  const Razorpay = require('razorpay');
  const instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
  const order = await instance.orders.create({ amount: amount * 100, currency: 'INR', receipt });
  res.json({ mock: false, ...order, keyId: process.env.RAZORPAY_KEY_ID });
};

exports.verifyPayment = async (req, res) => {
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
  if (!orderId) return res.status(400).json({ error: 'orderId is required' });

  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (order.consumerId.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Forbidden' });

  if (isRealRazorpay()) {
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');
    if (expected !== razorpay_signature) return res.status(400).json({ error: 'Invalid payment signature' });
  }

  order.paymentStatus = 'held_in_escrow';
  order.paymentId = razorpay_payment_id || 'mock_pay_' + crypto.randomBytes(6).toString('hex');
  await order.save();
  res.json({ order });
};
