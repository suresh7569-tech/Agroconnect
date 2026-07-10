const User = require('../models/User');
const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const Order = require('../models/Order');

exports.dashboardStats = async (_req, res) => {
  const [farmers, consumers, orders, revenue, pendingFarmers, pendingCrops] = await Promise.all([
    User.countDocuments({ role: 'farmer' }),
    User.countDocuments({ role: 'consumer' }),
    Order.countDocuments(),
    Order.aggregate([{ $match: { paymentStatus: { $in: ['held_in_escrow', 'released'] } } }, { $group: { _id: null, sum: { $sum: '$platformFee' } } }]),
    User.countDocuments({ role: 'farmer', isVerified: false }),
    Crop.countDocuments({ isApprovedByAdmin: false }),
  ]);
  res.json({
    farmers, consumers, orders,
    platformRevenue: revenue[0]?.sum || 0,
    pendingFarmers, pendingCrops,
  });
};

exports.pendingFarmers = async (_req, res) => {
  const users = await User.find({ role: 'farmer', isVerified: false })
    .select('-passwordHash')
    .sort({ createdAt: -1 })
    .lean();
  res.json({ users });
};

exports.approveFarmer = async (req, res) => {
  const user = await User.findOneAndUpdate(
    { _id: req.params.id, role: 'farmer' },
    { isVerified: true },
    { new: true }
  ).select('-passwordHash');
  if (!user) return res.status(404).json({ error: 'Farmer not found' });

  await Farm.updateMany({ farmerId: user._id }, { isApprovedByAdmin: true });

  res.json({ user });
};

exports.rejectFarmer = async (req, res) => {
  const user = await User.findOneAndUpdate(
    { _id: req.params.id, role: 'farmer' },
    { isActive: false },
    { new: true }
  ).select('-passwordHash');
  if (!user) return res.status(404).json({ error: 'Farmer not found' });
  res.json({ user });
};

exports.pendingCrops = async (_req, res) => {
  const crops = await Crop.find({ isApprovedByAdmin: false })
    .sort({ createdAt: -1 })
    .populate({ path: 'farmId', select: 'farmName farmerId', populate: { path: 'farmerId', select: 'name' } })
    .lean();
  res.json({ crops });
};

exports.approveCrop = async (req, res) => {
  const crop = await Crop.findByIdAndUpdate(req.params.id, { isApprovedByAdmin: true }, { new: true });
  if (!crop) return res.status(404).json({ error: 'Crop not found' });
  res.json({ crop });
};

exports.rejectCrop = async (req, res) => {
  const crop = await Crop.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!crop) return res.status(404).json({ error: 'Crop not found' });
  res.json({ crop });
};

// Admin creates a crop listing directly on behalf of a farmer's farm.
// Unlike the farmer-facing createCrop (in cropController.js), this takes
// farmId explicitly from the request body instead of deriving it from
// req.user, since the logged-in user here is the admin, not the farmer.
exports.adminCreateCrop = async (req, res) => {
  const {
    farmId, cropName, category, description, photos, videoUrl,
    pricePerUnit, unit, availableQuantity, minOrderQty, isInSeason,
  } = req.body || {};

  if (!farmId) return res.status(400).json({ error: 'farmId is required' });

  const farm = await Farm.findById(farmId);
  if (!farm) return res.status(404).json({ error: 'Farm not found' });

  if (!cropName || !pricePerUnit || !availableQuantity) {
    return res.status(400).json({ error: 'cropName, pricePerUnit and availableQuantity are required' });
  }
  if (!photos || !photos.length) {
    return res.status(400).json({ error: 'At least one crop photo is required' });
  }

  const crop = await Crop.create({
    farmId: farm._id,
    cropName, category, description, photos, videoUrl,
    pricePerUnit, unit, availableQuantity, minOrderQty, isInSeason,
    // Admin is creating this directly, so it's approved on creation —
    // no separate "review my own listing" step needed.
    isApprovedByAdmin: true,
  });

  res.status(201).json({ crop });
};

exports.listUsers = async (req, res) => {
  const { role } = req.query;
  const q = role ? { role } : {};
  const users = await User.find(q).select('-passwordHash').sort({ createdAt: -1 }).limit(200).lean();
  res.json({ users });
};

exports.setUserActive = async (req, res) => {
  const { isActive } = req.body || {};
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: !!isActive }, { new: true }).select('-passwordHash');
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
};
