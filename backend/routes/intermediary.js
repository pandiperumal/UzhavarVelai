const express = require('express');
const router = express.Router();
const Intermediary = require('../models/Intermediary');
const User = require('../models/User');

router.post('/register', async (req, res) => {
  try {
    const { userId, name, phone, aadhaarNumber, district, districtTamil, taluk, talukTamil, licenseNumber, experience, commission, preferredLanguage, coordinates } = req.body;
    
    const intermediary = new Intermediary({
      userId,
      name,
      phone,
      aadhaarNumber,
      district,
      districtTamil,
      taluk,
      talukTamil,
      licenseNumber,
      experience,
      commission,
      preferredLanguage,
      coordinates
    });
    
    await intermediary.save();
    res.status(201).json({ message: 'Intermediary registered successfully', intermediary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { district, taluk, active } = req.query;
    const query = {};
    
    if (district) query.district = district;
    if (taluk) query.taluk = taluk;
    if (active !== undefined) query.isActive = active === 'true';
    
    const intermediaries = await Intermediary.find(query).populate('userId', 'phone');
    res.json(intermediaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const intermediary = await Intermediary.findById(req.params.id).populate('userId', 'phone');
    if (!intermediary) return res.status(404).json({ message: 'Intermediary not found' });
    res.json(intermediary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const intermediary = await Intermediary.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!intermediary) return res.status(404).json({ message: 'Intermediary not found' });
    res.json({ message: 'Intermediary updated successfully', intermediary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const intermediary = await Intermediary.findByIdAndDelete(req.params.id);
    if (!intermediary) return res.status(404).json({ message: 'Intermediary not found' });
    await User.findByIdAndDelete(intermediary.userId);
    res.json({ message: 'Intermediary deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
