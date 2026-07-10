const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  cropId: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop', required: true },
  quantity: { type: Number, required: true, min: 1 },
  priceAtOrderTime: { type: Number, required: true, min: 0 },
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  consumerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true, index: true },
  items: { type: [OrderItemSchema], validate: v => v.length > 0 },
  totalAmount: { type: Number, required: true, min: 0 },
  platformFee: { type: Number, default: 0 },
  deliveryCharge: { type: Number, default: 0 },
  paymentStatus: {
    type: String,
    enum: ['pending', 'held_in_escrow', 'released', 'refunded', 'failed'],
    default: 'pending',
  },
  paymentMethod: { type: String, enum: ['upi', 'razorpay', 'cod'], required: true },
  paymentId: String,
  deliveryType: { type: String, enum: ['home', 'pickup'], required: true },
  deliveryAddress: {
    street: String,
    village: String,
    district: String,
    state: String,
    pincode: String,
  },
  expectedDeliveryDate: Date,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'packed', 'dispatched', 'delivered', 'cancelled'],
    default: 'pending',
    index: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
