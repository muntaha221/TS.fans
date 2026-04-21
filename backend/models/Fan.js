const mongoose = require('mongoose');

const fanSchema = new mongoose.Schema({
  nickname: { type: String, required: true },
  favoriteEra: { type: String, required: true },
  message: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Fan', fanSchema);
