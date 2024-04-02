const Favorite = require('../models/Favorite');

async function addToFavorites(req, res) {
  try {
    const { userId } = req.params;
    const { songId, name, imageUrl, songUrl } = req.body;
    let favorite = await Favorite.findOne({ userId });
    if (!favorite) {
      favorite = new Favorite({ userId, songs: [] });
    }
    favorite.songs.push({ songId, name, imageUrl, songUrl });
    await favorite.save();
    res.status(200).json({ message: 'Song added to favorites successfully', favorite });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getAllFavorites(req, res) {
  try {
    const { userId } = req.params;
    const favorite = await Favorite.findOne({ userId });
    if (!favorite) {
      return res.status(404).json({ message: 'Favorites not found for this user' });
    }
    res.status(200).json(favorite.songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
module.exports = { addToFavorites , getAllFavorites};
