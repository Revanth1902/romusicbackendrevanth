const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const playlistRoutes = require("./routes/playlistRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const recentlyPlayedRoutes = require("./routes/recentlyPlayedRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/playlist", playlistRoutes);
app.use("/favorite", favoriteRoutes);
app.use("/recentlyPlayed", recentlyPlayedRoutes);

// MongoDB Connection
mongoose
  .connect(
    "mongodb+srv://revanth19a:revanth@cluster0.4jsmfp8.mongodb.net/rolmusic",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Connected to MongoDB");
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
