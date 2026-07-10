const FarmVisit = require('../models/FarmVisit');
const Farm = require('../models/Farm');

const PACKAGE_PRICES = {
  basic_tour: 199,
  harvest_experience: 499,
  full_day_stay: 999,
};

exports.bookVisit = async (req, res) => {
  const { farmId, visitDate, timeSlot, packageType, numberOfVisitors } = req.body || {};
  if (!farmId || !visitDate || !timeSlot || !packageType || !numberOfVisitors) {
    return res.status(400).json({ error: 'farmId, visitDate, timeSlot, packageType and numberOfVisitors are required' });
  }
  if (!PACKAGE_PRICES[packageType]) return res.status(400).json({ error: 'Invalid package' });
  if (numberOfVisitors < 1 || numberOfVisitors > 30) return res.status(400).json({ error: 'Visitors must be 1–30' });

  const farm = await Farm.findById(farmId);
  if (!farm) return res.status(404).json({ error: 'Farm not found' });

  const totalAmount = PACKAGE_PRICES[packageType] * numberOfVisitors;

  const visit = await FarmVisit.create({
    farmId,
    consumerId: req.user._id,
    visitDate,
    timeSlot,
    packageType,
    numberOfVisitors,
    totalAmount,
    bookingStatus: 'confirmed',
    paymentId: 'mock_visit_' + Date.now(),
  });

  res.status(201).json({ visit });
};

exports.myVisits = async (req, res) => {
  const visits = await FarmVisit.find({ consumerId: req.user._id })
    .sort({ visitDate: -1 })
    .populate('farmId', 'farmName location')
    .lean();
  res.json({ visits });
};

exports.farmerVisits = async (req, res) => {
  const farm = await Farm.findOne({ farmerId: req.user._id });
  if (!farm) return res.json({ visits: [] });
  const visits = await FarmVisit.find({ farmId: farm._id })
    .sort({ visitDate: 1 })
    .populate('consumerId', 'name phone')
    .lean();
  res.json({ visits });
};

exports.cancelVisit = async (req, res) => {
  const visit = await FarmVisit.findById(req.params.id);
  if (!visit) return res.status(404).json({ error: 'Visit not found' });
  const isConsumer = visit.consumerId.toString() === req.user._id.toString();
  if (!isConsumer) return res.status(403).json({ error: 'Forbidden' });

  const hoursUntil = (new Date(visit.visitDate) - Date.now()) / 36e5;
  if (hoursUntil < 48) return res.status(400).json({ error: 'Cancellations must be at least 48 hours before the visit' });

  visit.bookingStatus = 'cancelled';
  await visit.save();
  res.json({ visit });
};
