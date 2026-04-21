const Album = require('../models/Album');
const Song = require('../models/Song');

// @desc    Get all albums
// @route   GET /api/albums
const getAlbums = async (req, res) => {
  try {
    const albums = await Album.find().sort({ releaseDate: -1 });
    res.json(albums);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get album by ID (with songs)
// @route   GET /api/albums/:id
const getAlbumById = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) return res.status(404).json({ message: 'Album not found' });
    
    const songs = await Song.find({ albumId: req.params.id });
    res.json({ album, songs });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create an album
// @route   POST /api/albums
const createAlbum = async (req, res) => {
  try {
    const album = await Album.create(req.body);
    res.status(201).json(album);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data' });
  }
};

// @desc    Update an album
// @route   PUT /api/albums/:id
const updateAlbum = async (req, res) => {
  try {
    const album = await Album.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!album) return res.status(404).json({ message: 'Album not found' });
    res.json(album);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data' });
  }
};

// @desc    Delete an album
// @route   DELETE /api/albums/:id
const deleteAlbum = async (req, res) => {
  try {
    const album = await Album.findByIdAndDelete(req.params.id);
    if (!album) return res.status(404).json({ message: 'Album not found' });
    // Also delete associated songs
    await Song.deleteMany({ albumId: req.params.id });
    res.json({ message: 'Album removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAlbums, getAlbumById, createAlbum, updateAlbum, deleteAlbum };
