
const mongoose = require("mongoose");

const tarotSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
      trim: true
    },
    cardName: {
      type: String,
      required: true,
      trim: true
    },
    subtitle: {
      type: String,
      default: "",
      trim: true
    },
    interpretation: {
      type: String,
      required: true,
      trim: true
    },
    guidance: {
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

module.exports = mongoose.model("Tarot", tarotSchema);
