const express = require('express');
const router = express.Router();
const { createPlaylist, addSongToPlaylist } = require('../controllers/playlistController');
const { getAllPlaylists, getPlaylistSongs } = require('../controllers/playlistController');

router.post('/:userId/create', createPlaylist);
router.post('/:playlistId/addSong', addSongToPlaylist);
router.get('/:userId/all', getAllPlaylists);
router.get('/:playlistId/songs', getPlaylistSongs);

module.exports = router;
