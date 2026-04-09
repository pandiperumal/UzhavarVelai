const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const TamilNaduGeo = require('../models/TamilNaduGeo');
const Admin = require('../models/Admin');
const tamilNaduGeoData = require('./tamilnaduGeo');

const seedDatabase = async () => {
  try {
    await connectDB();
    
    await TamilNaduGeo.deleteMany({});
    console.log('Cleared existing geo data');
    
    await TamilNaduGeo.insertMany(tamilNaduGeoData);
    console.log('Tamil Nadu geo data seeded successfully');
    
    await Admin.deleteMany({});
    const hashedPassword = await bcrypt.hash('1234', 10);
    await Admin.create({
      phone: 'admin',
      password: hashedPassword,
      name: 'Admin'
    });
    console.log('Admin created: admin / 1234');
    
    console.log('Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
