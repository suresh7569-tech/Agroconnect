const express = require('express');
const VanRoute = require('../models/VanRoute');

const router = express.Router();

const FALLBACK_VANS = [
  {
    _id: 'van-1',
    vanCode: 'MV-HYD-01',
    driverName: 'Suresh Reddy',
    driverPhone: '+91 90000 44441',
    city: 'Hyderabad',
    routeName: 'Kondapur → Gachibowli → Kukatpally',
    isRunning: true,
    currentLocation: { lat: 17.4649, lng: 78.3487 },
    stops: [
      { name: 'Kondapur Junction', location: { lat: 17.4649, lng: 78.3487 }, arrival: '07:00', departure: '08:00', status: 'departed' },
      { name: 'Gachibowli Circle',  location: { lat: 17.4400, lng: 78.3489 }, arrival: '08:30', departure: '10:00', status: 'current' },
      { name: 'HITEC City',         location: { lat: 17.4483, lng: 78.3915 }, arrival: '10:30', departure: '12:30', status: 'upcoming' },
      { name: 'Kukatpally Y-junc',  location: { lat: 17.4948, lng: 78.3996 }, arrival: '13:00', departure: '15:00', status: 'upcoming' },
    ],
    stockToday: [
      { crop: 'Organic Tomato', unit: 'kg', qty: 22, pricePerUnit: 60 },
      { crop: 'Palak (Spinach)', unit: 'bundle', qty: 30, pricePerUnit: 25 },
      { crop: 'Green Chillies', unit: 'kg', qty: 8, pricePerUnit: 80 },
    ],
  },
  {
    _id: 'van-2',
    vanCode: 'MV-HYD-02',
    driverName: 'Anitha Rao',
    driverPhone: '+91 90000 44442',
    city: 'Hyderabad',
    routeName: 'Banjara → Jubilee → Madhapur',
    isRunning: true,
    currentLocation: { lat: 17.4162, lng: 78.4348 },
    stops: [
      { name: 'Banjara Hills Rd 12', location: { lat: 17.4162, lng: 78.4348 }, arrival: '07:00', departure: '08:30', status: 'current' },
      { name: 'Jubilee Hills Rd 36', location: { lat: 17.4278, lng: 78.4082 }, arrival: '09:00', departure: '11:00', status: 'upcoming' },
      { name: 'Madhapur',            location: { lat: 17.4483, lng: 78.3915 }, arrival: '11:30', departure: '14:30', status: 'upcoming' },
    ],
    stockToday: [
      { crop: 'Brinjal', unit: 'kg', qty: 15, pricePerUnit: 45 },
      { crop: 'Palak (Spinach)', unit: 'bundle', qty: 18, pricePerUnit: 25 },
      { crop: 'Organic Tomato', unit: 'kg', qty: 25, pricePerUnit: 60 },
    ],
  },
  {
    _id: 'van-3',
    vanCode: 'MV-BLR-01',
    driverName: 'Manohar Gowda',
    driverPhone: '+91 90000 44443',
    city: 'Bengaluru',
    routeName: 'Koramangala → HSR → BTM',
    isRunning: false,
    currentLocation: { lat: 12.9352, lng: 77.6245 },
    stops: [
      { name: 'Koramangala 5th Block', location: { lat: 12.9352, lng: 77.6245 }, arrival: '07:00', departure: '09:00', status: 'upcoming' },
      { name: 'HSR Sector 1',          location: { lat: 12.9082, lng: 77.6476 }, arrival: '09:30', departure: '11:30', status: 'upcoming' },
      { name: 'BTM 2nd Stage',         location: { lat: 12.9166, lng: 77.6101 }, arrival: '12:00', departure: '15:00', status: 'upcoming' },
    ],
    stockToday: [
      { crop: 'Organic Tomato', unit: 'kg', qty: 30, pricePerUnit: 60 },
      { crop: 'Green Chillies', unit: 'kg', qty: 10, pricePerUnit: 80 },
    ],
  },
];

router.get('/', async (req, res, next) => {
  try {
    const { city } = req.query;
    let vans = [];
    try {
      vans = await VanRoute.find({}).lean();
    } catch (_) {
      vans = [];
    }
    if (!vans.length) vans = FALLBACK_VANS;
    if (city) {
      const needle = String(city).toLowerCase();
      vans = vans.filter(v => (v.city || '').toLowerCase().includes(needle));
    }
    res.json({ vans });
  } catch (e) { next(e); }
});

router.get('/:id', (req, res) => {
  const van = FALLBACK_VANS.find(v => v._id === req.params.id);
  if (!van) return res.status(404).json({ error: 'Van not found' });
  res.json({ van });
});

router.post('/:id/reserve', express.json(), (req, res) => {
  const { name, phone, items } = req.body || {};
  if (!name || !phone) return res.status(400).json({ error: 'name + phone required' });
  res.json({
    ok: true,
    reservationCode: 'RES-' + Math.floor(100000 + Math.random() * 900000).toString(),
    van: req.params.id,
    items: items || [],
    message: `Van will arrive at your stop soon, ${name}.`,
  });
});

module.exports = router;
