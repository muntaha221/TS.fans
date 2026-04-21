const Score = require('../models/Score');

// @desc    Get top 10 scores
// @route   GET /api/scores
const getLeaderboard = async (req, res) => {
  try {
    const scores = await Score.find().sort({ score: -1, createdAt: 1 }).limit(10);
    res.json(scores);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Submit new score
// @route   POST /api/scores
const submitScore = async (req, res) => {
  try {
    const { nickname, score } = req.body;
    if (!nickname || score === undefined) return res.status(400).json({ message: 'Missing fields' });
    
    // Create new score
    const newScore = await Score.create({ nickname, score });
    res.status(201).json(newScore);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data' });
  }
};

module.exports = { getLeaderboard, submitScore };
