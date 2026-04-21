const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  title: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  coverImage: { type: String, required: true },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Album', albumSchema);
