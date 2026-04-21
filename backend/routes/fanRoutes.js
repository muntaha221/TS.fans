const express = require('express');
const router = express.Router();
const { getCommunityWall, enrollFan } = require('../controllers/fanController');

router.route('/')
  .get(getCommunityWall)
  .post(enrollFan);

module.exports = router;
