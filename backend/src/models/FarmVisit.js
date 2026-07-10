const mongoose = require('mongoose');

const FarmVisitSchema = new mongoose.Schema({
  farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true, index: true },
  consumerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  visitDate: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  packageType: {
    type: String,
    enum: ['basic_tour', 'harvest_experience', 'full_day_stay'],
    required: true,
  },
  numberOfVisitors: { type: Number, required: true, min: 1 },
  totalAmount: { type: Number, required: true, min: 0 },
  bookingStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  paymentId: String,
}, { timestamps: true });

module.exports = mongoose.model('FarmVisit', FarmVisitSchema);
