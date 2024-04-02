const mongoose = require("mongoose");

const recentlyPlayedSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tracks: [
    {
      songId: { type: mongoose.Schema.Types.ObjectId, ref: "Song" },
      name: { type: String },
      imageUrl: { type: String },
      songUrl: { type: String },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("RecentlyPlayed", recentlyPlayedSchema);
