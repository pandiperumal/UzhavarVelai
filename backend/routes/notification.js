const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

router.get('/', async (req, res) => {
  try {
    const { userId, userType, isRead, page = 1, limit = 50 } = req.query;
    const query = {};
    
    if (userId) query.userId = userId;
    if (userType) query.userType = userType;
    if (isRead !== undefined) query.isRead = isRead === 'true';
    
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ ...query, isRead: false });
    
    res.json({ notifications, total, unreadCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json({ message: 'Notification marked as read', notification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/read-all', async (req, res) => {
  try {
    const { userId } = req.body;
    await Notification.updateMany({ userId, isRead: false }, { isRead: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
