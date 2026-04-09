const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');

router.post('/create', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    
    const notification = new Notification({
      userId: req.body.farmerId,
      userType: 'farmer',
      title: 'Booking Created',
      titleTamil: 'முன்பதிவு உருவாக்கப்பட்டது',
      message: 'Your booking has been created successfully',
      messageTamil: 'உங்கள் முன்பதிவு வெற்றிகரமாக உருவாக்கப்பட்டது',
      type: 'booking',
      data: { bookingId: booking._id }
    });
    await notification.save();
    
    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { farmerId, labourId, machineryId, status, date } = req.query;
    const query = {};
    
    if (farmerId) query.farmerId = farmerId;
    if (labourId) query.labourId = labourId;
    if (machineryId) query.machineryId = machineryId;
    if (status) query.status = status;
    if (date) {
      query.scheduledDate = {
        $gte: new Date(date),
        $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1))
      };
    }
    
    const bookings = await Booking.find(query)
      .populate('farmerId', 'name phone district taluk')
      .populate('labourId', 'name phone')
      .populate('machineryId', 'ownerName phone machineryType')
      .populate('intermediaryId', 'name phone')
      .sort({ scheduledDate: 1 });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    const recipientId = booking.bookingType === 'labour' ? booking.labourId : booking.machineryId;
    const userType = booking.bookingType === 'labour' ? 'labour' : 'machinery';
    
    const notification = new Notification({
      userId: recipientId,
      userType,
      title: 'Booking Updated',
      titleTamil: 'முன்பதிவு புதுப்பிக்கப்பட்டது',
      message: `Booking status changed to ${req.body.status}`,
      messageTamil: `முன்பதிவு நிலை ${req.body.status} ஆக மாற்றப்பட்டது`,
      type: 'booking',
      data: { bookingId: booking._id }
    });
    await notification.save();
    
    res.json({ message: 'Booking updated successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
