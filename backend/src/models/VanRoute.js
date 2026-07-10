const mongoose = require('mongoose');

const StopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  arrival: String,
  departure: String,
}, { _id: false });

const VanRouteSchema = new mongoose.Schema({
  vanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true, index: true },
  dayOfWeek: { type: String, enum: ['mon','tue','wed','thu','fri','sat','sun'], required: true, index: true },
  stops: { type: [StopSchema], default: [] },
  currentStopIdx: { type: Number, default: 0 },
  currentLocation: {
    lat: Number,
    lng: Number,
    updatedAt: Date,
  },
  isRunning: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('VanRoute', VanRouteSchema);
