const express = require('express');
const Store = require('../models/Store');

const router = express.Router();

const FALLBACK_STORES = [
  { _id: 'demo-hyd-jubilee', name: 'AgroConnect Jubilee Hills', code: 'HYD-JH', type: 'city_store',
    address: { line1: 'Road No. 36', city: 'Hyderabad', state: 'Telangana', pincode: '500033' },
    location: { lat: 17.4278, lng: 78.4082 }, hours: '7 AM – 10 PM', phone: '+91 90000 11111',
    services: ['pickup', 'delivery', 'subscription'], isActive: true },
  { _id: 'demo-hyd-kondapur', name: 'AgroConnect Kondapur', code: 'HYD-KD', type: 'city_store',
    address: { line1: 'Gachibowli Rd', city: 'Hyderabad', state: 'Telangana', pincode: '500084' },
    location: { lat: 17.4649, lng: 78.3487 }, hours: '7 AM – 9 PM', phone: '+91 90000 11112',
    services: ['pickup', 'delivery'], isActive: true },
  { _id: 'demo-blr-koramangala', name: 'AgroConnect Koramangala', code: 'BLR-KM', type: 'city_store',
    address: { line1: '5th Block, 80 Feet Rd', city: 'Bengaluru', state: 'Karnataka', pincode: '560095' },
    location: { lat: 12.9352, lng: 77.6245 }, hours: '7 AM – 10 PM', phone: '+91 90000 22221',
    services: ['pickup', 'delivery', 'subscription'], isActive: true },
  { _id: 'demo-blr-indiranagar', name: 'AgroConnect Indiranagar', code: 'BLR-IN', type: 'city_store',
    address: { line1: '100 Feet Rd', city: 'Bengaluru', state: 'Karnataka', pincode: '560038' },
    location: { lat: 12.9784, lng: 77.6408 }, hours: '7 AM – 9 PM', phone: '+91 90000 22222',
    services: ['pickup', 'delivery'], isActive: true },
  { _id: 'demo-medak-pc', name: 'Medak Procurement Center', code: 'PC-MDK', type: 'procurement_center',
    address: { line1: 'APMC Yard', city: 'Medak', state: 'Telangana', pincode: '502110' },
    location: { lat: 18.0459, lng: 78.2739 }, hours: '5 AM – 12 PM', phone: '+91 90000 33331',
    services: ['procurement', 'quality_check', 'cold_storage'], isActive: true },
];

router.get('/', async (req, res, next) => {
  try {
    const { type, city } = req.query;
    const q = { isActive: true };
    if (type) q.type = type;
    let stores = [];
    try {
      stores = await Store.find(q).lean();
    } catch (_) {
      stores = [];
    }
    if (!stores.length) {
      stores = FALLBACK_STORES.filter(s => !type || s.type === type);
    }
    if (city) {
      const needle = String(city).toLowerCase();
      stores = stores.filter(s => (s.address?.city || '').toLowerCase().includes(needle));
    }
    res.json({ stores });
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    let store = null;
    try {
      store = await Store.findById(req.params.id).lean();
    } catch (_) {}
    if (!store) {
      store = FALLBACK_STORES.find(s => s._id === req.params.id) || null;
    }
    if (!store) return res.status(404).json({ error: 'Store not found' });
    res.json({ store });
  } catch (e) { next(e); }
});

module.exports = router;
