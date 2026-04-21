const Song = require('../models/Song');

// @desc    Get song by ID
// @route   GET /api/songs/:id
const getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id).populate('albumId', 'title coverImage');
    if (!song) return res.status(404).json({ message: 'Song not found' });
    res.json(song);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a song
// @route   POST /api/songs
const createSong = async (req, res) => {
  try {
    const song = await Song.create(req.body);
    res.status(201).json(song);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data' });
  }
};

// @desc    Update a song
// @route   PUT /api/songs/:id
const updateSong = async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!song) return res.status(404).json({ message: 'Song not found' });
    res.json(song);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data' });
  }
};

// @desc    Delete a song
// @route   DELETE /api/songs/:id
const deleteSong = async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });
    res.json({ message: 'Song removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Like a song
// @route   POST /api/songs/:id/like
const likeSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });

    song.likes += 1;
    await song.save();
    
    res.json(song.likes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add a comment
// @route   POST /api/songs/:id/comment
const addComment = async (req, res) => {
  try {
    const { text, username } = req.body;
    const song = await Song.findById(req.params.id);
    
    if (!song) return res.status(404).json({ message: 'Song not found' });

    const comment = {
      username: username || 'Anonymous Swiftie',
      text
    };

    song.comments.push(comment);
    await song.save();
    
    res.json(song.comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getSongById, createSong, updateSong, deleteSong, likeSong, addComment };
