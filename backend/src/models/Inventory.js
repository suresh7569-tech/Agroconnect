const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true, index: true },
  cropId: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop', required: true, index: true },
  quantity: { type: Number, required: true, min: 0, default: 0 },
  reservedQty: { type: Number, min: 0, default: 0 },
  freshnessScore: { type: Number, min: 0, max: 100, default: 90 },
  harvestDate: Date,
  batchCode: String,
  qcStatus: {
    type: String,
    enum: ['pending', 'passed', 'rejected'],
    default: 'pending',
    index: true,
  },
  qcInspectorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  qcNotes: String,
}, { timestamps: true });

InventorySchema.index({ storeId: 1, cropId: 1 }, { unique: true });

module.exports = mongoose.model('Inventory', InventorySchema);
