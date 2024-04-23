const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  coverImage: { type: String },
  description: { type: String },
  songs: [
    {
      songId: { type: mongoose.Schema.Types.ObjectId, ref: "Song" },
      name: { type: String },
      imageUrl: { type: String },
      songUrl: { type: String },
    },
  ],
});

module.exports = mongoose.model("Playlist", playlistSchema);
