const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  aadhaarNumber: { type: String },
  district: { type: String, required: true },
  districtTamil: { type: String },
  taluk: { type: String, required: true },
  talukTamil: { type: String },
  village: { type: String },
  villageTamil: { type: String },
  address: { type: String },
  landArea: { type: Number },
  landUnit: { type: String, enum: ['acre', 'hectare'], default: 'acre' },
  cropsGrown: [{ type: String }],
  preferredLanguage: { type: String, enum: ['ta', 'en'], default: 'ta' },
  coordinates: {
    lat: Number,
    lng: Number
  },
  profilePhoto: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Farmer', farmerSchema);
