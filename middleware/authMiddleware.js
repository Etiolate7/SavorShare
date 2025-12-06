const User = require('../models/users');

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Middleware triggered");
  console.log("Authorization header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("No token provided or malformed header");
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Token extracted:", token);

  User.findOne({ token })
    .then(user => {
      if (!user) {
        console.log("Token invalid, user not found");
        return res.status(401).json({ message: "Invalid token" });
      }

      req.user = user;
      console.log("Token valid, user found:", user.username);
      next();
    })
    .catch(error => {
      console.error("Auth error:", error);
      return res.status(500).json({ message: "Server error" });
    });
};

module.exports = protect;