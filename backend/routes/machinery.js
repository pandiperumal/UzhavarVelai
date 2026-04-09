const express = require('express');
const router = express.Router();
const Machinery = require('../models/Machinery');
const User = require('../models/User');

router.post('/register', async (req, res) => {
  try {
    const { userId, ownerName, phone, aadhaarNumber, district, districtTamil, taluk, talukTamil, vehicleNumber, machineryType, machineryTypeTamil, purpose, purposeTamil, capacity, hourlyRate, dailyRate, available, preferredLanguage, coordinates, photos } = req.body;
    
    const machinery = new Machinery({
      userId,
      ownerName,
      phone,
      aadhaarNumber,
      district,
      districtTamil,
      taluk,
      talukTamil,
      vehicleNumber,
      machineryType,
      machineryTypeTamil,
      purpose,
      purposeTamil,
      capacity,
      hourlyRate,
      dailyRate,
      available,
      preferredLanguage,
      coordinates,
      photos
    });
    
    await machinery.save();
    res.status(201).json({ message: 'Machinery registered successfully', machinery });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { district, taluk, machineryType, purpose, available, active } = req.query;
    const query = {};
    
    if (district) query.district = district;
    if (taluk) query.taluk = taluk;
    if (machineryType) query.machineryType = machineryType;
    if (purpose) query.purpose = purpose;
    if (available !== undefined) query.available = available === 'true';
    if (active !== undefined) query.isActive = active === 'true';
    
    const machineries = await Machinery.find(query).populate('userId', 'phone');
    res.json(machineries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const machinery = await Machinery.findById(req.params.id).populate('userId', 'phone');
    if (!machinery) return res.status(404).json({ message: 'Machinery not found' });
    res.json(machinery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const machinery = await Machinery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!machinery) return res.status(404).json({ message: 'Machinery not found' });
    res.json({ message: 'Machinery updated successfully', machinery });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const machinery = await Machinery.findByIdAndDelete(req.params.id);
    if (!machinery) return res.status(404).json({ message: 'Machinery not found' });
    await User.findByIdAndDelete(machinery.userId);
    res.json({ message: 'Machinery deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
