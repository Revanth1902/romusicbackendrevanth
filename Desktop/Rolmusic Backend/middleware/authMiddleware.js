const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function authenticateUser(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authentication token is missing" });
    }
    const decodedToken = jwt.verify(token, "your_secret_key");
    const user = await User.findById(decodedToken.userId);
    if (!user) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }
    req.user = user;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ message: "Authentication failed", error: error.message });
  }
}

module.exports = { authenticateUser };
