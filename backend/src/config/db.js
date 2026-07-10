const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn('[db] MONGO_URI not set — running without a database (auth/data routes will fail).');
    return;
  }
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    console.log('[db] MongoDB connected');
  } catch (err) {
    console.error('[db] connection error:', err.message);
    console.warn('[db] continuing without DB so the API can still boot for scaffolding.');
  }
}

module.exports = connectDB;
