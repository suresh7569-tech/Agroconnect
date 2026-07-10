const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true, index: true },
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cropId: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop' },
  title: { type: String, required: true, trim: true },
  description: String,
  url: { type: String, required: true },
  thumbnailUrl: String,
  durationSec: Number,
  category: {
    type: String,
    enum: ['sowing', 'growing', 'harvest', 'processing', 'story'],
    default: 'story',
    index: true,
  },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  isApproved: { type: Boolean, default: false, index: true },
}, { timestamps: true });

module.exports = mongoose.model('Video', VideoSchema);
