const mongoose = require('mongoose');

const intermediarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  aadhaarNumber: { type: String },
  district: { type: String, required: true },
  districtTamil: { type: String },
  taluk: { type: String, required: true },
  talukTamil: { type: String },
  licenseNumber: { type: String },
  experience: { type: Number },
  commission: { type: Number },
  preferredLanguage: { type: String, enum: ['ta', 'en'], default: 'ta' },
  coordinates: {
    lat: Number,
    lng: Number
  },
  profilePhoto: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Intermediary', intermediarySchema);
