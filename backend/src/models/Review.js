const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
  consumerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true, index: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  reviewText: String,
  reviewPhotos: [String],
  isVerifiedPurchase: { type: Boolean, default: true },
  isReported: { type: Boolean, default: false },
}, { timestamps: true });

ReviewSchema.index({ farmId: 1, createdAt: -1 });

module.exports = mongoose.model('Review', ReviewSchema);
