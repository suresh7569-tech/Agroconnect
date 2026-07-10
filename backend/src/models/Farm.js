const mongoose = require('mongoose');

const FarmSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  farmName: { type: String, required: true, trim: true },
  description: String,
  location: {
    lat: Number,
    lng: Number,
    address: String,
    village: String,
    district: String,
    state: String,
    pincode: String,
  },
  photos: [String],
  certifications: [String],
  isApprovedByAdmin: { type: Boolean, default: false, index: true },
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Farm', FarmSchema);
