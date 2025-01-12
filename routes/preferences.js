const express = require("express");
const authenticateToken = require("../middlewares/authMiddleware");
const users = require("../users");

const router = express.Router();

router.use(authenticateToken);

router.get("/", (req, res) => {
  const user = users.find((u) => u.email === req.user.email);

  console.log("User:", user);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  console.log("Preferences:", user.preferences);

  res.status(200).json(user.preferences || {});
});

router.put("/", (req, res) => {
  const { preferences } = req.body;
  const user = users.find((u) => u.email === req.user.email);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.preferences = { ...user.preferences, ...preferences };
  res.status(200).json({ message: "Preferences updated" });
});

module.exports = router;
