require("dotenv").config();
const express = require("express");
const axios = require("axios");
const authenticateToken = require("../middlewares/authMiddleware");
const router = express.Router();
const users = require("../users");

router.use(authenticateToken);

router.get("/", async (req, res) => {
  const user = users.find((u) => u.email === req.user.email);

  if (!user || !user.preferences) {
    return res.status(400).json({ message: "No preferences found" });
  }

  const { categories, languages } = user.preferences;

  const topic = categories ? `&topic=${categories[0]}` : "";
  const lang = languages ? `&lang=${languages[0]}` : "";

  try {
    console.log("GNews API Key:", process.env.NEWS_API_KEY);

    const response = await axios.get(
      `https://gnews.io/api/v4/top-headlines?apikey=${process.env.NEWS_API_KEY}${topic}${lang}`
    );

    res.status(200).json(response.data.articles);
  } catch (error) {
    console.error(
      "Error fetching news:",
      error.response?.data || error.message
    );
    res
      .status(500)
      .json({ message: "Failed to fetch news", error: error.message });
  }
});

module.exports = router;
