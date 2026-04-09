const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

router.post('/register', async (req, res) => {
  try {
    const { phone, password, role } = req.body;
    
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    
    const user = new User({
      phone,
      password: hashedPassword,
      role,
      otp,
      otpExpires: new Date(Date.now() + 10 * 60 * 1000)
    });
    
    await user.save();
    
    res.status(201).json({ 
      message: 'Registration successful. Please verify OTP.',
      userId: user._id,
      otp: otp
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;
    
    const user = await User.findOne({ 
      phone, 
      otp, 
      otpExpires: { $gt: new Date() } 
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'uzhavarvelai_secret', { expiresIn: '7d' });
    
    res.json({ 
      message: 'OTP verified successfully',
      token,
      user: { id: user._id, phone: user.phone, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { phone, password, role } = req.body;
    
    const user = await User.findOne({ phone, role });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'uzhavarvelai_secret', { expiresIn: '7d' });
    
    res.json({ 
      message: 'Login successful',
      token,
      user: { id: user._id, phone: user.phone, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/admin/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    
    const admin = await Admin.findOne({ phone });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET || 'uzhavarvelai_secret', { expiresIn: '7d' });
    
    res.json({ 
      message: 'Admin login successful',
      token,
      admin: { id: admin._id, phone: admin.phone, name: admin.name }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/resend-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    
    res.json({ message: 'OTP resent successfully', otp: otp });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
