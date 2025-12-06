const User = require('../models/users');

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  User.findOne({ token })
    .then(user => {
      if (!user) {
        return res.status(401).json({ message: "Invalid token" });
      }

      req.user = user;
      next();
    })
    .catch(error => {
      console.error("Auth error:", error);
      return res.status(500).json({ message: "Server error" });
    });
};

module.exports = protect;
