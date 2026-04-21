const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  albumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Album', required: true },
  duration: { type: String, required: true },
  likes: { type: Number, default: 0 },
  comments: [{
    username: { type: String, default: 'Anonymous Swiftie' },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Song', songSchema);
