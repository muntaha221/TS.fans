const express = require('express');
const router = express.Router();
const { getSongById, createSong, updateSong, deleteSong, likeSong, addComment, getPreviewUrl } = require('../controllers/songController');

router.route('/')
  .post(createSong);

router.route('/:id')
  .get(getSongById)
  .put(updateSong)
  .delete(deleteSong);

router.get('/preview/fetch', getPreviewUrl);
router.post('/:id/like', likeSong);
router.post('/:id/comment', addComment);

module.exports = router;
