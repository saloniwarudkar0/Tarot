
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

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
