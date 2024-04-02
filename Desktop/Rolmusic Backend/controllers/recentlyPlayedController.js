const RecentlyPlayed = require("../models/RecentlyPlayed");

async function addToRecentlyPlayed(req, res) {
  try {
    const { userId } = req.params;
    const { songId, name, imageUrl, songUrl } = req.body;

    // Check if the required fields are present in the request body
    if (!songId || !name || !imageUrl || !songUrl) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let recentlyPlayed = await RecentlyPlayed.findOne({ userId });
    if (!recentlyPlayed) {
      recentlyPlayed = new RecentlyPlayed({ userId, tracks: [] });
    }
    // Remove old tracks if more than 20
    if (recentlyPlayed.tracks.length >= 20) {
      recentlyPlayed.tracks.shift();
    }
    recentlyPlayed.tracks.push({ songId, name, imageUrl, songUrl });
    await recentlyPlayed.save();
    res
      .status(200)
      .json({
        message: "Song added to recently played successfully",
        recentlyPlayed,
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


async function getAllRecentlyPlayed(req, res) {
  try {
    const { userId } = req.params;
    const recentlyPlayed = await RecentlyPlayed.findOne({ userId });
    if (!recentlyPlayed) {
      return res.status(404).json({ message: "Recently played list not found" });
    }
    res.status(200).json(recentlyPlayed.tracks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { addToRecentlyPlayed, getAllRecentlyPlayed };