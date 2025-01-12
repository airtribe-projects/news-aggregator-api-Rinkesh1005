require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const users = require("../users");

router.post("/register", async (req, res) => {
  const { email, password, preferences } = req.body;
  if (!email || typeof email !== "string") {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (!password || password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }

  if (users.find((user) => user.email === email)) {
    return res.status(400).json({ message: "Email already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userPreferences = preferences || {
    categories: [],
    languages: [],
    theme: "light",
  };
  users.push({ email, password: hashedPassword, preferences: userPreferences });
  res.status(201).json({ message: "User registered" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ message: "Invalid email format" });
  }
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  const user = users.find((u) => u.email === email);

  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.status(200).json({ token });
});

module.exports = router;
