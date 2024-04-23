const Playlist = require("../models/Playlist");

async function createPlaylist(req, res) {
  try {
    const { userId, name, coverImage, description } = req.body;
    const playlist = new Playlist({
      userId,
      name,
      coverImage,
      description,
      songs: [],
    });
    await playlist.save();
    res
      .status(201)
      .json({ message: "Playlist created successfully", playlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function addSongToPlaylist(req, res) {
  try {
    const { playlistId } = req.params;
    const { songId, name, imageUrl, songUrl } = req.body;
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    playlist.songs.push({ songId, name, imageUrl, songUrl });
    await playlist.save();
    res
      .status(200)
      .json({ message: "Song added to playlist successfully", playlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function getAllPlaylists(req, res) {
  try {
    const { userId } = req.params;
    const playlists = await Playlist.find({ userId });
    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function getPlaylistSongs(req, res) {
  try {
    const { playlistId } = req.params;
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    res.status(200).json(playlist.songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
module.exports = {
  createPlaylist,
  addSongToPlaylist,
  getAllPlaylists,
  getPlaylistSongs,
};
