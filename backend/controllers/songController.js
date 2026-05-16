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

// @desc    Proxy fetch iTunes preview URL
// @route   GET /api/songs/preview/fetch
const getPreviewUrl = async (req, res) => {
  try {
    const { term } = req.query;
    if (!term) return res.status(400).json({ message: 'Term is required' });

    // Clean term to improve iTunes search hit rate (remove "From The Vault" and "feat.")
    let cleanTerm = term.replace(/\(From The Vault\)/gi, '').replace(/\[From The Vault\]/gi, '').trim();
    cleanTerm = cleanTerm.replace(/\(feat\.[^)]+\)/gi, '').trim();

    const searchTerm = encodeURIComponent(cleanTerm);
    const response = await fetch(`https://itunes.apple.com/search?term=${searchTerm}&entity=song&limit=1`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      res.json({ previewUrl: data.results[0].previewUrl });
    } else {
      res.status(404).json({ message: 'Preview not found' });
    }
  } catch (error) {
    console.error('Proxy Fetch Error:', error);
    res.status(500).json({ message: 'Failed to fetch preview' });
  }
};

module.exports = { getSongById, createSong, updateSong, deleteSong, likeSong, addComment, getPreviewUrl };
