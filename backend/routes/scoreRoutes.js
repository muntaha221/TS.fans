const express = require('express');
const router = express.Router();
const { getLeaderboard, submitScore } = require('../controllers/scoreController');

router.route('/')
  .get(getLeaderboard)
  .post(submitScore);

module.exports = router;
