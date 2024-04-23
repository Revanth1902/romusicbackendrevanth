// routes/songRoutes.js
const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');

router.get('/songs', songController.getAllSongs);
router.post('/songs', songController.createSong);
router.get('/songs/:id', songController.getSongById);

module.exports = router;
