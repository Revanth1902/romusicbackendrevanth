// controllers/songController.js
const Song = require('../models/song');

exports.getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }
    res.json(song);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createSong = async (req, res) => {
  const song = new Song({
    name: req.body.name,
    description: req.body.description,
    url: req.body.url
  });

  try {
    const newSong = await song.save();
    res.status(201).json(newSong);
    console.log(req.body);

  } catch (err) {
    res.status(400).json({ message: err.message });
    console.log(req.body);

  }
  
};
