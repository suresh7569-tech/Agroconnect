const Crop = require('../models/Crop');
const Farm = require('../models/Farm');

exports.listCrops = async (req, res) => {
  const { search, category, minPrice, maxPrice, sort = 'newest' } = req.query;
  const q = { isApprovedByAdmin: true, isActive: true };
  if (category) q.category = category;
  if (minPrice) q.pricePerUnit = { ...q.pricePerUnit, $gte: Number(minPrice) };
  if (maxPrice) q.pricePerUnit = { ...q.pricePerUnit, $lte: Number(maxPrice) };
  if (search) q.$text = { $search: search };

  const sortOpts = {
    newest: { createdAt: -1 },
    price_asc: { pricePerUnit: 1 },
    price_desc: { pricePerUnit: -1 },
  }[sort] || { createdAt: -1 };

  const crops = await Crop.find(q).sort(sortOpts).populate({
    path: 'farmId',
    select: 'farmName location averageRating',
  }).lean();

  res.json({ crops });
};

exports.getCrop = async (req, res) => {
  const crop = await Crop.findById(req.params.id).populate({
    path: 'farmId',
    select: 'farmName location averageRating farmerId',
    populate: { path: 'farmerId', select: 'name' },
  }).lean();
  if (!crop) return res.status(404).json({ error: 'Crop not found' });
  res.json({ crop });
};

exports.myCrops = async (req, res) => {
  const farm = await Farm.findOne({ farmerId: req.user._id });
  if (!farm) return res.json({ crops: [] });
  const crops = await Crop.find({ farmId: farm._id }).sort({ createdAt: -1 }).lean();
  res.json({ crops });
};

exports.createCrop = async (req, res) => {
  const farm = await Farm.findOne({ farmerId: req.user._id });
  if (!farm) return res.status(400).json({ error: 'Create your farm profile before adding crops' });

  const {
    cropName, category, description, photos, videoUrl,
    pricePerUnit, unit, availableQuantity, minOrderQty, isInSeason,
  } = req.body || {};

  if (!cropName || !pricePerUnit || !availableQuantity) {
    return res.status(400).json({ error: 'cropName, pricePerUnit and availableQuantity are required' });
  }
  if (!photos || !photos.length) return res.status(400).json({ error: 'At least one crop photo is required' });

  const crop = await Crop.create({
    farmId: farm._id,
    cropName, category, description, photos, videoUrl,
    pricePerUnit, unit, availableQuantity, minOrderQty, isInSeason,
    isApprovedByAdmin: farm.isApprovedByAdmin,
  });
  res.status(201).json({ crop });
};

exports.updateCrop = async (req, res) => {
  const farm = await Farm.findOne({ farmerId: req.user._id });
  if (!farm) return res.status(404).json({ error: 'Farm not found' });

  const crop = await Crop.findOne({ _id: req.params.id, farmId: farm._id });
  if (!crop) return res.status(404).json({ error: 'Crop not found' });

  const allowed = ['cropName', 'category', 'description', 'photos', 'videoUrl',
    'pricePerUnit', 'unit', 'availableQuantity', 'minOrderQty', 'isInSeason', 'isActive'];
  for (const k of allowed) if (k in req.body) crop[k] = req.body[k];
  await crop.save();
  res.json({ crop });
};

exports.deleteCrop = async (req, res) => {
  const farm = await Farm.findOne({ farmerId: req.user._id });
  if (!farm) return res.status(404).json({ error: 'Farm not found' });
  await Crop.deleteOne({ _id: req.params.id, farmId: farm._id });
  res.json({ ok: true });
};
