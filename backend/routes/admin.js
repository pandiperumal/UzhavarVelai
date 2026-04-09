const express = require('express');
const router = express.Router();
const Farmer = require('../models/Farmer');
const Labour = require('../models/Labour');
const Machinery = require('../models/Machinery');
const Intermediary = require('../models/Intermediary');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Admin = require('../models/Admin');

router.get('/stats', async (req, res) => {
  try {
    const [farmers, labours, machineries, intermediaries, bookings] = await Promise.all([
      Farmer.countDocuments({ isActive: true }),
      Labour.countDocuments({ isActive: true }),
      Machinery.countDocuments({ isActive: true }),
      Intermediary.countDocuments({ isActive: true }),
      Booking.countDocuments()
    ]);
    
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    
    res.json({
      farmers,
      labours,
      machineries,
      intermediaries,
      totalBookings: bookings,
      pendingBookings,
      completedBookings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/bookings', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    
    if (status) query.status = status;
    
    const bookings = await Booking.find(query)
      .populate('farmerId', 'name phone')
      .populate('labourId', 'name phone')
      .populate('machineryId', 'ownerName phone')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await Booking.countDocuments(query);
    
    res.json({ bookings, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/booking/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ message: 'Booking status updated', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/verify-admin', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'uzhavarvelai_secret');
    
    if (decoded.role !== 'admin') return res.status(403).json({ message: 'Not authorized' });
    
    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    
    res.json({ valid: true, admin: { id: admin._id, phone: admin.phone, name: admin.name } });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
