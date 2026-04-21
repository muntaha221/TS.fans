const Fan = require('../models/Fan');

// @desc    Get all community fans
// @route   GET /api/fans
const getCommunityWall = async (req, res) => {
  try {
    const fans = await Fan.find().sort({ createdAt: -1 }); // Get latest first
    res.json(fans);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Enroll a fan
// @route   POST /api/fans
const enrollFan = async (req, res) => {
  try {
    const { nickname, favoriteEra, message } = req.body;
    if (!nickname || !favoriteEra || !message) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }
    const fan = await Fan.create({ nickname, favoriteEra, message });
    res.status(201).json(fan);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data' });
  }
};

module.exports = { getCommunityWall, enrollFan };
