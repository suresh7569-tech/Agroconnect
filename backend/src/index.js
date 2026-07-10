require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');

const healthRoutes = require('./routes/health');
const authRoutes = require('./routes/auth');
const farmRoutes = require('./routes/farms');
const cropRoutes = require('./routes/crops');
const orderRoutes = require('./routes/orders');
const visitRoutes = require('./routes/visits');
const reviewRoutes = require('./routes/reviews');
const adminRoutes = require('./routes/admin');
const paymentRoutes = require('./routes/payments');
const uploadRoutes = require('./routes/uploads');
const seedRoutes = require('./routes/seed');
const storeRoutes = require('./routes/stores');
const videoRoutes = require('./routes/videos');
const vanRoutes = require('./routes/vans');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '5mb' }));
app.use(morgan('dev'));

app.use('/api/auth/login', rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }));
app.use('/api/auth/otp', rateLimit({ windowMs: 60 * 1000, max: 5 }));

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/vans', vanRoutes);

app.get('/', (_req, res) => {
  res.json({ name: 'AgroConnect API', status: 'ok', version: '1.0.0' });
});

app.use((_req, res) => res.status(404).json({ error: 'Not Found' }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => console.log(`AgroConnect API listening on http://localhost:${PORT}`));
connectDB();
