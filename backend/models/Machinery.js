const mongoose = require('mongoose');

const machinerySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ownerName: { type: String, required: true },
  phone: { type: String, required: true },
  aadhaarNumber: { type: String },
  district: { type: String, required: true },
  districtTamil: { type: String },
  taluk: { type: String, required: true },
  talukTamil: { type: String },
  vehicleNumber: { type: String, required: true },
  machineryType: { type: String, required: true },
  machineryTypeTamil: { type: String },
  purpose: { type: String, required: true },
  purposeTamil: { type: String },
  capacity: { type: String },
  hourlyRate: { type: Number },
  dailyRate: { type: Number },
  available: { type: Boolean, default: true },
  preferredLanguage: { type: String, enum: ['ta', 'en'], default: 'ta' },
  coordinates: {
    lat: Number,
    lng: Number
  },
  photos: [{ type: String }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Machinery', machinerySchema);
