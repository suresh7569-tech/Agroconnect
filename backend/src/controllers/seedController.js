const User = require('../models/User');
const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const { hashPassword } = require('../utils/hash');

const credentials = {
  admin:    { email: 'admin@agroconnect.dev',    password: 'password123' },
  farmer:   { email: 'ravi@agroconnect.dev',     password: 'password123' },
  consumer: { email: 'priya@agroconnect.dev',    password: 'password123' },
};

exports.seedDemo = async (_req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Seeding disabled in production' });
  }

  const [existingAdmin, existingFarmer, existingConsumer] = await Promise.all([
    User.findOne({ email: 'admin@agroconnect.dev' }),
    User.findOne({ email: 'ravi@agroconnect.dev' }),
    User.findOne({ email: 'priya@agroconnect.dev' }),
  ]);

  if (existingAdmin && existingFarmer && existingConsumer) {
    return res.json({ message: 'Demo data already present.', credentials });
  }

  const pw = await hashPassword('password123');

  const admin = existingAdmin || await User.create({
    name: 'Platform Admin', email: 'admin@agroconnect.dev', phone: '9000000001',
    passwordHash: pw, role: 'admin', isVerified: true,
  });

  const farmer = existingFarmer || await User.create({
    name: 'Ravi Kumar', email: 'ravi@agroconnect.dev', phone: '9000000002',
    passwordHash: pw, role: 'farmer', isVerified: true,
    address: { village: 'Kondapur', district: 'Medak', state: 'Telangana', pincode: '502248' },
    govtIdUrl: 'https://example.com/aadhaar-ravi.jpg',
    landDocUrl: 'https://example.com/land-ravi.pdf',
  });

  const consumer = existingConsumer || await User.create({
    name: 'Priya Sharma', email: 'priya@agroconnect.dev', phone: '9000000003',
    passwordHash: pw, role: 'consumer', isVerified: true,
    address: { street: 'Road No. 12', village: 'Banjara Hills', district: 'Hyderabad', state: 'Telangana', pincode: '500034' },
  });

  let farm = await Farm.findOne({ farmerId: farmer._id });
  if (!farm) {
    farm = await Farm.create({
      farmerId: farmer._id,
      farmName: 'Ravi Organics',
      description: '3-acre certified organic farm growing seasonal vegetables and leafy greens, no chemicals since 2019.',
      location: {
        lat: 17.4791, lng: 78.3585,
        address: 'Kondapur Village, Medak',
        village: 'Kondapur', district: 'Medak', state: 'Telangana', pincode: '502248',
      },
      photos: ['https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=70'],
      certifications: ['PGS-India'],
      isApprovedByAdmin: true,
    });
  }

  const cropCount = await Crop.countDocuments({ farmId: farm._id });
  if (cropCount === 0) {
    await Crop.insertMany([
      {
        farmId: farm._id, cropName: 'Organic Tomato', category: 'vegetables',
        description: 'Vine-ripened, hand-picked. No sprays, no fumes.',
        photos: ['https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=900&q=70'],
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        pricePerUnit: 60, unit: 'kg', availableQuantity: 40, minOrderQty: 1,
        isInSeason: true, isApprovedByAdmin: true,
      },
      {
        farmId: farm._id, cropName: 'Palak (Spinach)', category: 'leafy_greens',
        description: 'Cut this morning. Bright green, tender leaves.',
        photos: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=900&q=70'],
        pricePerUnit: 25, unit: 'bundle', availableQuantity: 25, minOrderQty: 2,
        isInSeason: true, isApprovedByAdmin: true,
      },
      {
        farmId: farm._id, cropName: 'Green Chillies', category: 'vegetables',
        description: 'Fresh, medium-hot local variety.',
        photos: ['https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&w=900&q=70'],
        pricePerUnit: 80, unit: 'kg', availableQuantity: 12, minOrderQty: 1,
        isInSeason: true, isApprovedByAdmin: true,
      },
      {
        farmId: farm._id, cropName: 'Brinjal (Baingan)', category: 'vegetables',
        description: 'Small, tender purple brinjal. Best for curries.',
        photos: ['https://images.unsplash.com/photo-1613936220186-d55f30c9a5f7?auto=format&fit=crop&w=900&q=70'],
        pricePerUnit: 45, unit: 'kg', availableQuantity: 20, minOrderQty: 1,
        isInSeason: true, isApprovedByAdmin: false,
      },
    ]);
  }

  res.json({ message: 'Demo data ready.', credentials });
};
