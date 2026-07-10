const mongoose = require('mongoose');

const StoreSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  type: { type: String, enum: ['city_store', 'procurement_center', 'mobile_van'], required: true, index: true },
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  address: {
    line1: String,
    city: String,
    district: String,
    state: String,
    pincode: String,
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  hours: { type: String, default: '7 AM – 9 PM' },
  phone: String,
  services: { type: [String], default: [] },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

StoreSchema.index({ type: 1, isActive: 1 });

module.exports = mongoose.model('Store', StoreSchema);
