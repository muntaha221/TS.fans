const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  nickname: { type: String, required: true },
  score: { type: Number, required: true, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Score', scoreSchema);
