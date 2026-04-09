const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  bookingType: { type: String, enum: ['labour', 'machinery'], required: true },
  labourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Labour' },
  machineryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Machinery' },
  intermediaryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Intermediary' },
  district: { type: String, required: true },
  taluk: { type: String, required: true },
  village: { type: String },
  workType: { type: String, required: true },
  workTypeTamil: { type: String },
  scheduledDate: { type: Date, required: true },
  duration: { type: String },
  wage: { type: Number },
  status: { type: String, enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'], default: 'pending' },
  remarks: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
