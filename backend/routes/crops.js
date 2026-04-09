const express = require('express');
const router = express.Router();

const cropsData = [
  { id: 'paddy', name: 'Paddy / Rice', nameTamil: 'அரிசி / நெல்', season: 'Kharif', category: 'cereal' },
  { id: 'wheat', name: 'Wheat', nameTamil: 'கோதுமை', season: 'Rabi', category: 'cereal' },
  { id: 'sorghum', name: 'Sorghum / Cholam', nameTamil: 'சோளம்', season: 'Kharif', category: 'cereal' },
  { id: 'pearl_millet', name: 'Pearl Millet / Cumbu', nameTamil: 'கம்பு', season: 'Kharif', category: 'cereal' },
  { id: 'finger_millet', name: 'Finger Millet / Ragi', nameTamil: 'ராகி', season: 'Kharif', category: 'cereal' },
  { id: 'little_millet', name: 'Little Millet / Samai', nameTamil: 'சாமை', season: 'Kharif', category: 'cereal' },
  { id: 'maize', name: 'Maize', nameTamil: 'மக்க்கோல்', season: 'Kharif', category: 'cereal' },
  { id: 'cotton', name: 'Cotton', nameTamil: 'பருத்தி', season: 'Kharif', category: 'commercial' },
  { id: 'sugarcane', name: 'Sugarcane', nameTamil: 'கரும்பு', season: 'Annual', category: 'commercial' },
  { id: 'groundnut', name: 'Groundnut', nameTamil: 'நிலக்கடலை', season: 'Kharif', category: 'oilseed' },
  { id: 'sesamum', name: 'Sesamum', nameTamil: 'எள்', season: 'Kharif', category: 'oilseed' },
  { id: 'sunflower', name: 'Sunflower', nameTamil: 'சூரியகாந்தி', season: 'Kharif', category: 'oilseed' },
  { id: 'coconut', name: 'Coconut', nameTamil: 'தேங்காய்', season: 'Perennial', category: 'plantation' },
  { id: 'banana', name: 'Banana', nameTamil: 'வாழை', season: 'Perennial', category: 'horticulture' },
  { id: 'mango', name: 'Mango', nameTamil: 'மாம்பழம்', season: 'Perennial', category: 'horticulture' },
  { id: 'tamil_grapes', name: 'Grapes', nameTamil: 'திராட்சை', season: 'Perennial', category: 'horticulture' },
  { id: 'guava', name: 'Guava', nameTamil: 'கொய்யா', season: 'Perennial', category: 'horticulture' },
  { id: 'tamarind', name: 'Tamarind', nameTamil: 'புளி', season: 'Perennial', category: 'plantation' },
  { id: 'turmeric', name: 'Turmeric', nameTamil: 'மஞ்சள்', season: 'Kharif', category: 'spice' },
  { id: 'chilli', name: 'Chilli', nameTamil: 'மிளகாய்', season: 'Kharif', category: 'spice' },
  { id: 'black_pepper', name: 'Black Pepper', nameTamil: 'கருப்பு மிளகு', season: 'Perennial', category: 'spice' },
  { id: 'cardamom', name: 'Cardamom', nameTamil: 'ஏலக்காய்', season: 'Perennial', category: 'spice' },
  { id: 'coffee', name: 'Coffee', nameTamil: 'காபி', season: 'Perennial', category: 'plantation' },
  { id: 'tea', name: 'Tea', nameTamil: 'தேநீர்', season: 'Perennial', category: 'plantation' },
  { id: 'rubber', name: 'Rubber', nameTamil: 'மரத்தை', season: 'Perennial', category: 'plantation' },
  { id: 'tomato', name: 'Tomato', nameTamil: 'தக்காளி', season: 'All', category: 'vegetable' },
  { id: 'onion', name: 'Onion', nameTamil: 'வெங்காயம்', season: 'Rabi', category: 'vegetable' },
  { id: 'potato', name: 'Potato', nameTamil: 'உருளைக்கிழங்கு', season: 'Rabi', category: 'vegetable' },
  { id: 'brinjal', name: 'Brinjal', nameTamil: 'கத்தரிக்காய்', season: 'All', category: 'vegetable' },
  { id: 'bhendi', name: 'Bhendi / Okra', nameTamil: 'வெண்டைக்காய்', season: 'All', category: 'vegetable' },
  { id: 'cluster_beans', name: 'Cluster Beans', nameTamil: 'கொத்தவரங்காய்', season: 'Kharif', category: 'vegetable' },
  { id: 'ridge_gourd', name: 'Ridge Gourd', nameTamil: 'பீர்க்கங்காய்', season: 'Kharif', category: 'vegetable' },
  { id: 'bottle_gourd', name: 'Bottle Gourd', nameTamil: 'சுரைக்காய்', season: 'Kharif', category: 'vegetable' },
  { id: 'bitter_gourd', name: 'Bitter Gourd', nameTamil: 'பாகற்காய்', season: 'Kharif', category: 'vegetable' },
  { id: 'colocasia', name: 'Colocasia / Seppankizhangu', nameTamil: 'சேபான்கிழங்கு', season: 'Kharif', category: 'vegetable' },
  { id: 'sweet_potato', name: 'Sweet Potato', nameTamil: 'சர்க்கரைவள்ளி', season: 'Kharif', category: 'vegetable' },
  { id: ' tapioca', name: 'Tapioca', nameTamil: 'மரவள்ளி', season: 'Annual', category: 'vegetable' },
  { id: 'drumstick', name: 'Drumstick / Murungakai', nameTamil: 'முருங்கைக்காய்', season: 'Perennial', category: 'vegetable' },
  { id: 'amaranthus', name: 'Amaranthus / Keerai', nameTamil: 'கீரை', season: 'All', category: 'leafy' }
];

const machineryData = [
  { id: 'tractor', name: 'Tractor', nameTamil: 'ட்ராக்டர்', purposes: ['ploughing', 'tilling', 'transport', 'harvesting'] },
  { id: 'rotavator', name: 'Rotavator', nameTamil: 'ரோட்டாவேட்டர்', purposes: ['soil_preparation', 'seedbed_preparation'] },
  { id: 'plough', name: 'Plough', nameTamil: 'உழவு', purposes: ['ploughing', 'turning_soil'] },
  { id: 'power_tiller', name: 'Power Tiller', nameTamil: 'பவர் டில்லர்', purposes: ['tilling', 'weeding', 'threshing'] },
  { id: 'seed_drill', name: 'Seed Drill', nameTamil: 'விதை பதில்', purposes: ['sowing', 'seeding'] },
  { id: 'transplanter', name: 'Transplanter', nameTamil: 'நடவு இயந்திரம்', purposes: ['transplanting', 'rice_transplanting'] },
  { id: 'sprayer', name: 'Sprayer', nameTamil: 'தெளிப்பான்', purposes: ['spraying', 'pesticide_application', 'fertilizer_application'] },
  { id: 'duster', name: 'Duster', nameTamil: 'தூசி படுக்கும் இயந்திரம்', purposes: ['pesticide_dusting', 'powder_spraying'] },
  { id: 'combined_harvester', name: 'Combined Harvester', nameTamil: 'கம்பைன் ஹார்வஸ்டர்', purposes: ['harvesting', 'threshing', 'winnowing'] },
  { id: 'paddy_harvester', name: 'Paddy Harvester', nameTamil: 'நெல் அறுவடை இயந்திரம்', purposes: ['paddy_harvesting', 'threshing'] },
  { id: 'thresher', name: 'Thresher', nameTamil: 'மரச்சுமை நீக்கி', purposes: ['threshing', 'grain_separation'] },
  { id: 'winnowing_fan', name: 'Winnowing Fan', nameTamil: 'தூற்று விசிறி', purposes: ['winnowing', 'grain_cleaning'] },
  { id: 'rice_mill', name: 'Rice Mill', nameTamil: 'அரிசி மில்', purposes: ['milling', 'polishing', 'grading'] },
  { id: 'sugarcane_harvester', name: 'Sugarcane Harvester', nameTamil: 'கரும்பு அறுவடை இயந்திரம்', purposes: ['sugarcane_harvesting', 'cutting'] },
  { id: 'cotton_picker', name: 'Cotton Picker', nameTamil: 'பருத்தி பறித்தல் இயந்திரம்', purposes: ['cotton_picking', 'harvesting'] },
  { id: 'groundnut_digger', name: 'Groundnut Digger', nameTamil: 'நிலக்கடலை பறித்தல்', purposes: ['groundnut_digging', 'harvesting'] },
  { id: 'trailer', name: 'Trailer', nameTamil: 'வண்டி', purposes: ['transport', 'carrying', 'loading'] },
  { id: 'pump_set', name: 'Pump Set', nameTamil: 'நீர் இறைப்பான்', purposes: ['irrigation', 'water_pumping', 'drainage'] },
  { id: ' sprinkler', name: 'Sprinkler System', nameTamil: 'தெளிப்பு அமைப்பு', purposes: ['irrigation', 'watering'] },
  { id: 'drip_irrigation', name: 'Drip Irrigation Unit', nameTamil: 'துளி பாசனம்', purposes: ['drip_irrigation', 'fertilizer_application'] },
  { id: 'electric_motor', name: 'Electric Motor', nameTamil: 'மின்சார மோட்டார்', purposes: ['power_source', 'irrigation', 'milling'] },
  { id: 'chaff_cutter', name: 'Chaff Cutter', nameTamil: 'தீவன வெட்டி', purposes: ['fodder_cutting', 'animal_feed_preparation'] },
  { id: 'feed_mixer', name: 'Feed Mixer', nameTamil: 'தீனி கலக்கி', purposes: ['feed_mixing', 'animal_feed_preparation'] },
  { id: 'milking_machine', name: 'Milking Machine', nameTamil: 'பால் இறைப்பான்', purposes: ['milking', 'dairy'] },
  { id: 'cane_crusher', name: 'Cane Crusher', nameTamil: 'கரும்பு நொறுக்கி', purposes: ['sugarcane_crushing', 'juice_extraction'] },
  { id: 'oil_expeller', name: 'Oil Expeller', nameTamil: 'எண்ணெய் பிழிவான்', purposes: ['oil_extraction', 'seed_processing'] }
];

const workTypesData = [
  { id: 'ploughing', name: 'Ploughing', nameTamil: 'உழவு', category: 'land_preparation' },
  { id: 'tilling', name: 'Tilling', nameTamil: 'உழுதல்', category: 'land_preparation' },
  { id: 'levelling', name: 'Levelling', nameTamil: 'சமப்படுத்துதல்', category: 'land_preparation' },
  { id: 'puddling', name: 'Puddling', nameTamil: 'நீர் பரப்பு', category: 'land_preparation' },
  { id: 'sowing', name: 'Sowing / Transplanting', nameTamil: 'விதைத்தல் / நடுதல்', category: 'planting' },
  { id: 'weeding', name: 'Weeding', nameTamil: 'களை எடுத்தல்', category: 'maintenance' },
  { id: 'fertilizer_application', name: 'Fertilizer Application', nameTamil: 'உரம் இடுதல்', category: 'maintenance' },
  { id: 'pesticide_spraying', name: 'Pesticide Spraying', nameTamil: 'பூச்சி மருந்து தெளித்தல்', category: 'maintenance' },
  { id: 'irrigation', name: 'Irrigation', nameTamil: 'நீர்ப்பாசனம்', category: 'maintenance' },
  { id: 'harvesting', name: 'Harvesting', nameTamil: 'அறுவடை', category: 'harvesting' },
  { id: 'threshing', name: 'Threshing', nameTamil: 'மரச்சுமை நீக்குதல்', category: 'post_harvest' },
  { id: 'winnowing', name: 'Winnowing', nameTamil: 'தூற்றுதல்', category: 'post_harvest' },
  { id: 'drying', name: 'Drying', nameTamil: 'உலர்த்துதல்', category: 'post_harvest' },
  { id: 'storage', name: 'Storage', nameTamil: 'சேமிப்பு', category: 'post_harvest' },
  { id: 'transport', name: 'Transport', nameTamil: 'அனுப்புதல்', category: 'transport' },
  { id: 'loading', name: 'Loading / Unloading', nameTamil: 'ஏற்றுதல் / இறக்குதல்', category: 'transport' }
];

router.get('/crops', (req, res) => {
  res.json(cropsData);
});

router.get('/machinery', (req, res) => {
  res.json(machineryData);
});

router.get('/work-types', (req, res) => {
  res.json(workTypesData);
});

router.get('/skills', (req, res) => {
  const skillsData = [
    { id: 'ploughing', name: 'Ploughing', nameTamil: 'உழவு' },
    { id: 'sowing', name: 'Sowing', nameTamil: 'விதைத்தல்' },
    { id: 'transplanting', name: 'Transplanting', nameTamil: 'நடுதல்' },
    { id: 'weeding', name: 'Weeding', nameTamil: 'களை எடுத்தல்' },
    { id: 'harvesting', name: 'Harvesting', nameTamil: 'அறுவடை' },
    { id: 'threshing', name: 'Threshing', nameTamil: 'மரச்சுமை நீக்குதல்' },
    { id: 'winnowing', name: 'Winnowing', nameTamil: 'தூற்றுதல்' },
    { id: 'pesticide_application', name: 'Pesticide Application', nameTamil: 'பூச்சி மருந்து இடுதல்' },
    { id: ' fertilizer_application', name: 'Fertilizer Application', nameTamil: 'உரம் இடுதல்' },
    { id: 'irrigation_management', name: 'Irrigation Management', nameTamil: 'நீர் மேலாண்மை' },
    { id: 'dairy_farming', name: 'Dairy Farming', nameTamil: 'பால் வளர்க்கும் தொழில்' },
    { id: 'poultry_farming', name: 'Poultry Farming', nameTamil: 'கோழி வளர்த்தல்' },
    { id: 'cattle_care', name: 'Cattle Care', nameTamil: 'கால்நடை பராமரிப்பு' },
    { id: 'vegetable_cultivation', name: 'Vegetable Cultivation', nameTamil: 'காய்கறி விவசாயம்' },
    { id: 'fruit_cultivation', name: 'Fruit Cultivation', nameTamil: 'பழம் விவசாயம்' },
    { id: 'flower_cultivation', name: 'Flower Cultivation', nameTamil: 'மலர் விவசாயம்' },
    { id: 'nursery_management', name: 'Nursery Management', nameTamil: 'இளந்தோற்ற மேலாண்மை' },
    { id: 'vermicompost', name: 'Vermicompost', nameTamil: 'மண்புழு உரம்' },
    { id: 'beekeeping', name: 'Beekeeping', nameTamil: 'தேனீ வளர்த்தல்' },
    { id: 'sericulture', name: 'Sericulture', nameTamil: 'பட்டு வளர்த்தல்' }
  ];
  res.json(skillsData);
});

module.exports = router;
