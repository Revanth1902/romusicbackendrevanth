// recentlyPlayedRoutes.js

const express = require("express");
const router = express.Router();
const {
  addToRecentlyPlayed,
  getAllRecentlyPlayed,
} = require("../controllers/recentlyPlayedController");

// Route to add a track to recently played
router.post("/:userId/add", addToRecentlyPlayed);

// Route to get all recently played tracks for a user
router.get("/:userId", getAllRecentlyPlayed);

module.exports = router;
