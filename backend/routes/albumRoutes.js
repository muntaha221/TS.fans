const express = require('express');
const router = express.Router();
const { getAlbums, getAlbumById, createAlbum, updateAlbum, deleteAlbum } = require('../controllers/albumController');

router.route('/')
  .get(getAlbums)
  .post(createAlbum);

router.route('/:id')
  .get(getAlbumById)
  .put(updateAlbum)
  .delete(deleteAlbum);

module.exports = router;
