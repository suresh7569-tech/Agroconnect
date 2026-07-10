const Review = require('../models/Review');
const Order = require('../models/Order');
const Farm = require('../models/Farm');

exports.createReview = async (req, res) => {
  const { orderId, rating, reviewText, reviewPhotos } = req.body || {};
  if (!orderId || !rating) return res.status(400).json({ error: 'orderId and rating are required' });
  if (rating < 1 || rating > 5) return res.status(400).json({ error: 'rating must be between 1 and 5' });

  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (order.consumerId.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Not your order' });
  if (order.status !== 'delivered') return res.status(400).json({ error: 'You can review only after delivery is confirmed' });

  const existing = await Review.findOne({ orderId, consumerId: req.user._id });
  if (existing) return res.status(409).json({ error: 'You have already reviewed this order' });

  const review = await Review.create({
    orderId,
    consumerId: req.user._id,
    farmId: order.farmId,
    rating,
    reviewText,
    reviewPhotos,
  });

  const agg = await Review.aggregate([
    { $match: { farmId: order.farmId } },
    { $group: { _id: '$farmId', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  if (agg[0]) {
    await Farm.updateOne({ _id: order.farmId }, { averageRating: agg[0].avg, totalReviews: agg[0].count });
  }

  res.status(201).json({ review });
};

exports.listByFarm = async (req, res) => {
  const reviews = await Review.find({ farmId: req.params.farmId })
    .sort({ createdAt: -1 })
    .populate('consumerId', 'name')
    .lean();
  res.json({ reviews });
};
