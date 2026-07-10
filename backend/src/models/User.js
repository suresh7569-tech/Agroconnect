const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  street: String,
  village: String,
  district: String,
  state: String,
  pincode: String,
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true, unique: true, trim: true },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: ['farmer', 'consumer', 'admin', 'store_manager', 'quality_inspector', 'delivery_partner', 'van_staff'],
    required: true,
    default: 'consumer',
  },
  assignedStoreId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
  profilePhoto: String,
  govtIdUrl: String,
  landDocUrl: String,
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  address: AddressSchema,
  preferredLanguage: { type: String, enum: ['en', 'hi', 'te', 'ta'], default: 'en' },
}, { timestamps: true });

UserSchema.index({ role: 1, isVerified: 1 });

module.exports = mongoose.model('User', UserSchema);
