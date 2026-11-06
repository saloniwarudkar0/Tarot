
const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    style: {
      type: String,
      default: "journal-moon"
    },
    intro: {
      type: String,
      required: true,
      trim: true
    },
    content: [
      {
        heading: {
          type: String,
          required: true,
          trim: true
        },
        text: {
          type: String,
          required: true,
          trim: true
        }
      }
    ],
    status: {
      type: String,
      enum: ["Draft", "Published"],
      default: "Draft"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Journal", journalSchema);
