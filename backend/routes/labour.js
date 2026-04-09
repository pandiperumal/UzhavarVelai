const express = require('express');
const router = express.Router();
const Labour = require('../models/Labour');
const User = require('../models/User');

router.post('/register', async (req, res) => {
  try {
    const { userId, name, phone, age, gender, aadhaarNumber, district, districtTamil, taluk, talukTamil, village, villageTamil, skills, dailyWage, available, preferredLanguage, coordinates } = req.body;
    
    const labour = new Labour({
      userId,
      name,
      phone,
      age,
      gender,
      aadhaarNumber,
      district,
      districtTamil,
      taluk,
      talukTamil,
      village,
      villageTamil,
      skills,
      dailyWage,
      available,
      preferredLanguage,
      coordinates
    });
    
    await labour.save();
    res.status(201).json({ message: 'Labour registered successfully', labour });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { district, taluk, skill, available, active } = req.query;
    const query = {};
    
    if (district) query.district = district;
    if (taluk) query.taluk = taluk;
    if (skill) query['skills.skill'] = skill;
    if (available !== undefined) query.available = available === 'true';
    if (active !== undefined) query.isActive = active === 'true';
    
    const labours = await Labour.find(query).populate('userId', 'phone');
    res.json(labours);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const labour = await Labour.findById(req.params.id).populate('userId', 'phone');
    if (!labour) return res.status(404).json({ message: 'Labour not found' });
    res.json(labour);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const labour = await Labour.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!labour) return res.status(404).json({ message: 'Labour not found' });
    res.json({ message: 'Labour updated successfully', labour });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const labour = await Labour.findByIdAndDelete(req.params.id);
    if (!labour) return res.status(404).json({ message: 'Labour not found' });
    await User.findByIdAndDelete(labour.userId);
    res.json({ message: 'Labour deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
