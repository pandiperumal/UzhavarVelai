const express = require('express');
const router = express.Router();
const Farmer = require('../models/Farmer');
const User = require('../models/User');

router.post('/register', async (req, res) => {
  try {
    const { userId, name, phone, aadhaarNumber, district, districtTamil, taluk, talukTamil, village, villageTamil, address, landArea, landUnit, cropsGrown, preferredLanguage, coordinates } = req.body;
    
    const farmer = new Farmer({
      userId,
      name,
      phone,
      aadhaarNumber,
      district,
      districtTamil,
      taluk,
      talukTamil,
      village,
      villageTamil,
      address,
      landArea,
      landUnit,
      cropsGrown,
      preferredLanguage,
      coordinates
    });
    
    await farmer.save();
    res.status(201).json({ message: 'Farmer registered successfully', farmer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { district, taluk, crop, active } = req.query;
    const query = {};
    
    if (district) query.district = district;
    if (taluk) query.taluk = taluk;
    if (crop) query.cropsGrown = crop;
    if (active !== undefined) query.isActive = active === 'true';
    
    const farmers = await Farmer.find(query).populate('userId', 'phone');
    res.json(farmers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id).populate('userId', 'phone');
    if (!farmer) return res.status(404).json({ message: 'Farmer not found' });
    res.json(farmer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const farmer = await Farmer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!farmer) return res.status(404).json({ message: 'Farmer not found' });
    res.json({ message: 'Farmer updated successfully', farmer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const farmer = await Farmer.findByIdAndDelete(req.params.id);
    if (!farmer) return res.status(404).json({ message: 'Farmer not found' });
    await User.findByIdAndDelete(farmer.userId);
    res.json({ message: 'Farmer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
