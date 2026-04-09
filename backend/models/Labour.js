const mongoose = require('mongoose');

const labourSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  age: { type: Number },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  aadhaarNumber: { type: String },
  district: { type: String, required: true },
  districtTamil: { type: String },
  taluk: { type: String, required: true },
  talukTamil: { type: String },
  village: { type: String },
  villageTamil: { type: String },
  skills: [{
    skill: { type: String },
    skillTamil: { type: String },
    experience: { type: Number }
  }],
  dailyWage: { type: Number },
  available: { type: Boolean, default: true },
  preferredLanguage: { type: String, enum: ['ta', 'en'], default: 'ta' },
  coordinates: {
    lat: Number,
    lng: Number
  },
  profilePhoto: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Labour', labourSchema);
