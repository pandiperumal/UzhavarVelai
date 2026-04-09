const express = require('express');
const router = express.Router();
const TamilNaduGeo = require('../models/TamilNaduGeo');

router.get('/districts', async (req, res) => {
  try {
    const districts = await TamilNaduGeo.find({}, 'district districtTamil').sort({ district: 1 });
    res.json(districts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/taluks/:district', async (req, res) => {
  try {
    const geo = await TamilNaduGeo.findOne({ district: req.params.district });
    if (!geo) return res.status(404).json({ message: 'District not found' });
    res.json(geo.taluks.map(t => ({ name: t.name, nameTamil: t.nameTamil })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/villages/:district/:taluk', async (req, res) => {
  try {
    const geo = await TamilNaduGeo.findOne({ district: req.params.district });
    if (!geo) return res.status(404).json({ message: 'District not found' });
    
    const taluk = geo.taluks.find(t => t.name === req.params.taluk);
    if (!taluk) return res.status(404).json({ message: 'Taluk not found' });
    
    res.json(taluk.villages.map(v => ({ name: v.name, nameTamil: v.nameTamil, coordinates: v.coordinates })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    
    const results = await TamilNaduGeo.find({
      $or: [
        { district: { $regex: q, $options: 'i' } },
        { districtTamil: { $regex: q, $options: 'i' } }
      ]
    }).limit(10);
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
