const express = require('express');
const router = express.Router();
const { addToFavorites } = require('../controllers/favoriteController');
const { getAllFavorites } = require('../controllers/favoriteController');

router.post('/:userId/add', addToFavorites);
router.get('/:userId', getAllFavorites);

module.exports = router;

