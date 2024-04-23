const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  songs: [{
    songId: { type: mongoose.Schema.Types.ObjectId, ref: 'Song' },
    name: { type: String },
    imageUrl: { type: String },
    songUrl: { type: String }
  }]
});

module.exports = mongoose.model('Favorite', favoriteSchema);
