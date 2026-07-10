const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const Review = require('../models/Review');
const User = require('../models/User');

exports.listFarms = async (req, res) => {
  const { district, state } = req.query;
  const q = { isApprovedByAdmin: true };
  if (district) q['location.district'] = new RegExp(district, 'i');
  if (state) q['location.state'] = new RegExp(state, 'i');

  const farms = await Farm.find(q).populate('farmerId', 'name preferredLanguage').lean();
  res.json({ farms });
};

exports.getFarm = async (req, res) => {
  const farm = await Farm.findById(req.params.id).populate('farmerId', 'name preferredLanguage').lean();
  if (!farm) return res.status(404).json({ error: 'Farm not found' });

  const [crops, reviews] = await Promise.all([
    Crop.find({ farmId: farm._id, isApprovedByAdmin: true, isActive: true }).lean(),
    Review.find({ farmId: farm._id }).sort({ createdAt: -1 }).limit(20).populate('consumerId', 'name').lean(),
  ]);

  res.json({ farm, crops, reviews });
};

exports.createOrUpdateMyFarm = async (req, res) => {
  const { farmName, description, location, photos, certifications } = req.body || {};
  if (!farmName) return res.status(400).json({ error: 'farmName is required' });

  const existing = await Farm.findOne({ farmerId: req.user._id });
  if (existing) {
    existing.set({ farmName, description, location, photos, certifications });
    await existing.save();
    return res.json({ farm: existing });
  }

  const farm = await Farm.create({
    farmerId: req.user._id,
    farmName,
    description,
    location,
    photos,
    certifications,
    isApprovedByAdmin: req.user.isVerified,
  });
  res.status(201).json({ farm });
};

exports.getMyFarm = async (req, res) => {
  const farm = await Farm.findOne({ farmerId: req.user._id }).lean();
  res.json({ farm });
};
