const Order = require('../models/Order');
const Crop = require('../models/Crop');
const Farm = require('../models/Farm');

const PLATFORM_FEE_RATE = 0.05;
const HOME_DELIVERY_CHARGE = 60;

exports.createOrder = async (req, res) => {
  const { farmId, items, deliveryType, deliveryAddress, paymentMethod, expectedDeliveryDate } = req.body || {};
  if (!farmId || !Array.isArray(items) || !items.length) {
    return res.status(400).json({ error: 'farmId and items are required' });
  }
  if (!['home', 'pickup'].includes(deliveryType)) return res.status(400).json({ error: 'Invalid deliveryType' });
  if (!['upi', 'razorpay', 'cod'].includes(paymentMethod)) return res.status(400).json({ error: 'Invalid paymentMethod' });

  const cropIds = items.map(i => i.cropId);
  const crops = await Crop.find({ _id: { $in: cropIds }, farmId, isActive: true });
  if (crops.length !== cropIds.length) return res.status(400).json({ error: 'One or more crops are unavailable' });

  const priced = items.map(i => {
    const crop = crops.find(c => c._id.toString() === i.cropId);
    if (i.quantity < (crop.minOrderQty || 1)) throw Object.assign(new Error(`Minimum ${crop.minOrderQty} for ${crop.cropName}`), { status: 400 });
    if (i.quantity > crop.availableQuantity) throw Object.assign(new Error(`Only ${crop.availableQuantity} ${crop.unit} of ${crop.cropName} available`), { status: 400 });
    return { cropId: i.cropId, quantity: i.quantity, priceAtOrderTime: crop.pricePerUnit };
  });

  const subtotal = priced.reduce((sum, p) => sum + p.quantity * p.priceAtOrderTime, 0);
  if (paymentMethod === 'cod' && subtotal > 2000) {
    return res.status(400).json({ error: 'COD is not available for orders above ₹2000' });
  }
  const platformFee = Math.round(subtotal * PLATFORM_FEE_RATE);
  const deliveryCharge = deliveryType === 'home' ? HOME_DELIVERY_CHARGE : 0;
  const totalAmount = subtotal + platformFee + deliveryCharge;

  const order = await Order.create({
    consumerId: req.user._id,
    farmId,
    items: priced,
    totalAmount,
    platformFee,
    deliveryCharge,
    paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
    paymentMethod,
    deliveryType,
    deliveryAddress,
    expectedDeliveryDate,
    status: paymentMethod === 'cod' ? 'confirmed' : 'confirmed',
  });

  await Promise.all(priced.map(p =>
    Crop.updateOne({ _id: p.cropId }, { $inc: { availableQuantity: -p.quantity } })
  ));

  res.status(201).json({ order });
};

exports.myOrders = async (req, res) => {
  const orders = await Order.find({ consumerId: req.user._id })
    .sort({ createdAt: -1 })
    .populate('farmId', 'farmName location')
    .populate('items.cropId', 'cropName unit photos')
    .lean();
  res.json({ orders });
};

exports.getOrder = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('farmId', 'farmName location farmerId')
    .populate('items.cropId', 'cropName unit photos')
    .lean();
  if (!order) return res.status(404).json({ error: 'Order not found' });
  const isConsumer = order.consumerId.toString() === req.user._id.toString();
  const isFarmer = order.farmId.farmerId?.toString() === req.user._id.toString();
  if (!isConsumer && !isFarmer && req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  res.json({ order });
};

exports.farmerOrders = async (req, res) => {
  const farm = await Farm.findOne({ farmerId: req.user._id });
  if (!farm) return res.json({ orders: [] });
  const orders = await Order.find({ farmId: farm._id })
    .sort({ createdAt: -1 })
    .populate('consumerId', 'name phone')
    .populate('items.cropId', 'cropName unit')
    .lean();
  res.json({ orders });
};

exports.updateStatus = async (req, res) => {
  const { status } = req.body || {};
  const allowed = ['confirmed', 'packed', 'dispatched', 'delivered', 'cancelled'];
  if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });

  const order = await Order.findById(req.params.id).populate('farmId', 'farmerId');
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const isFarmer = order.farmId.farmerId?.toString() === req.user._id.toString();
  const isConsumer = order.consumerId.toString() === req.user._id.toString();

  if (status === 'cancelled' && !isConsumer && !isFarmer) return res.status(403).json({ error: 'Forbidden' });
  if (status !== 'cancelled' && !isFarmer) return res.status(403).json({ error: 'Only the farmer can advance status' });

  order.status = status;
  if (status === 'delivered' && order.paymentStatus === 'held_in_escrow') {
    order.paymentStatus = 'released';
  }
  await order.save();
  res.json({ order });
};
