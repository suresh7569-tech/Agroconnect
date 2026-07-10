const mongoose = require('mongoose');

const CropSchema = new mongoose.Schema({
  farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true, index: true },
  cropName: { type: String, required: true, trim: true },
  category: { type: String, index: true },
  description: String,
  photos: { type: [String], validate: v => v.length >= 1 },
  videoUrl: String,
  pricePerUnit: { type: Number, required: true, min: 0 },
  unit: { type: String, enum: ['kg', 'dozen', 'bundle', 'piece'], default: 'kg' },
  availableQuantity: { type: Number, required: true, min: 0 },
  minOrderQty: { type: Number, default: 1, min: 1 },
  isInSeason: { type: Boolean, default: true },
  isApprovedByAdmin: { type: Boolean, default: false, index: true },
  isActive: { type: Boolean, default: true },
  supplyStage: {
    type: String,
    enum: ['listed', 'at_procurement', 'quality_check', 'in_store', 'sold_out'],
    default: 'listed',
    index: true,
  },
  freshnessScore: { type: Number, min: 0, max: 100, default: 92 },
  harvestDate: Date,
}, { timestamps: true });

CropSchema.index({ cropName: 'text', description: 'text' });

module.exports = mongoose.model('Crop', CropSchema);
