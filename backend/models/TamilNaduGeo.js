const mongoose = require('mongoose');

const tamilNaduGeoSchema = new mongoose.Schema({
  district: { type: String, required: true, index: true },
  districtTamil: { type: String, required: true },
  taluks: [{
    name: { type: String, required: true },
    nameTamil: { type: String, required: true },
    villages: [{
      name: { type: String, required: true },
      nameTamil: { type: String, required: true },
      coordinates: {
        lat: Number,
        lng: Number
      }
    }]
  }]
}, { timestamps: true });

module.exports = mongoose.model('TamilNaduGeo', tamilNaduGeoSchema);
