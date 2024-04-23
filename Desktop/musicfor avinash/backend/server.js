// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const songRoutes = require('./routes/songRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://kchaitanyaavinash02:RMG4nDlZ94xxibBL@popularsoundtracks.ig3wsa8.mongodb.net/popularsoundtracks"
);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to database');
});

// Routes
app.use('/api', songRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
