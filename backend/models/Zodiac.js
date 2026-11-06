const mongoose = require("mongoose");

const zodiacSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    symbol: {
      type: String,
      required: true,
      trim: true
    },
    dates: {
      type: String,
      required: true,
      trim: true
    },
    element: {
      type: String,
      required: true,
      trim: true
    },
    planet: {
      type: String,
      required: true,
      trim: true
    },
    quality: {
      type: String,
      required: true,
      trim: true
    },
    color: {
      type: String,
      required: true,
      trim: true
    },
    traits: {
      type: String,
      required: true,
      trim: true
    },
    strengths: {
      type: String,
      required: true,
      trim: true
    },
    weaknesses: {
      type: String,
      required: true,
      trim: true
    },
    love: {
      type: String,
      required: true,
      trim: true
    },
    career: {
      type: String,
      required: true,
      trim: true
    },
    about: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ["Draft", "Published"],
      default: "Draft"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Zodiac", zodiacSchema);