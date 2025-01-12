require("dotenv").config();
const express = require("express");
const authRoutes = require("./routes/auth");
const preferencesRoutes = require("./routes/preferences");
const newsRoutes = require("./routes/news");

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/preferences", preferencesRoutes);
app.use("/news", newsRoutes);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

module.exports = app;