const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userType: { type: String, enum: ['farmer', 'labour', 'machinery', 'intermediary'], required: true },
  title: { type: String, required: true },
  titleTamil: { type: String },
  message: { type: String, required: true },
  messageTamil: { type: String },
  type: { type: String, enum: ['booking', 'alert', 'system', 'offer'], default: 'system' },
  isRead: { type: Boolean, default: false },
  data: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
