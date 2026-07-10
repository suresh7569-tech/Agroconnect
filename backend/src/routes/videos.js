const express = require('express');
const Video = require('../models/Video');

const router = express.Router();

const FALLBACK_VIDEOS = [
  { _id: 'v1', title: 'Tomato harvest morning ritual', description: 'Ravi walks his tomato beds before sunrise.',
    farmName: 'Ravi Organics', farmerName: 'Ravi Kumar', category: 'harvest',
    thumbnailUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=900&q=70',
    url: 'https://www.youtube.com/embed/EQDlamjDwG0', durationSec: 1290, views: 352000 },
  { _id: 'v2', title: 'Palak sowing — from seed to sprout',
    farmName: 'Sundari Farms', farmerName: 'Sundari Devi', category: 'sowing',
    thumbnailUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=900&q=70',
    url: 'https://www.youtube.com/embed/hrXVTz9aXsI', durationSec: 92, views: 812 },
  { _id: 'v3', title: 'Why we never spray after fruiting',
    farmName: 'Green Roots Collective', farmerName: 'Anwar Ali', category: 'story',
    thumbnailUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=900&q=70',
    url: 'https://www.youtube.com/embed/K6csA6YLGUg', durationSec: 214, views: 3560 },
  
  

];

router.get('/', async (req, res, next) => {
  try {
    const { category } = req.query;
    let videos = [];
    try {
      const q = { isApproved: true };
      if (category) q.category = category;
      videos = await Video.find(q).populate('farmId', 'farmName').populate('farmerId', 'name').lean();
    } catch (_) {
      videos = [];
    }
    if (!videos.length) {
      videos = FALLBACK_VIDEOS.filter(v => !category || v.category === category);
    }
    res.json({ videos });
  } catch (e) { next(e); }
});

module.exports = router;
