
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const adminRoutes = require("./routes/adminRoutes");
const journalRoutes = require("./routes/journalRoutes");
const tarotRoutes = require("./routes/tarotRoutes");
const zodiacRoutes = require("./routes/zodiacRoutes");
const aboutRoutes = require("./routes/aboutRoutes");

const app = express();

app.use(cors());
app.use(express.json());

console.log("Environment Check:", {
  MONGO_URI: Boolean(process.env.MONGO_URI),
  JWT_SECRET: Boolean(process.env.JWT_SECRET),
  ADMIN_EMAIL: Boolean(process.env.ADMIN_EMAIL),
  ADMIN_PASSWORD_HASH: Boolean(process.env.ADMIN_PASSWORD_HASH)
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "DIVINE CARAT Backend is running!"
  });
});

app.use("/api/admin", adminRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/tarot", tarotRoutes);
app.use("/api/zodiac", zodiacRoutes);
app.use("/api/about", aboutRoutes);

const PORT = process.env.PORT || 5000;

// Start server first
app.listen(PORT, "0.0.0.0", async () => {
  console.log(`Server running on port ${PORT}`);

  try {
    await connectDB();
  } catch (error) {
    console.error("Database startup error:", error.message);
  }
});
