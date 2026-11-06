
const express = require("express");
const mongoose = require("mongoose");
const Tarot = require("../models/Tarot");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public: Get all published tarot readings
router.get("/public", async (req, res) => {
  try {
    const readings = await Tarot.find({ status: "Published" })
      .sort({ date: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      readings
    });
  } catch (error) {
    console.error("Public Tarot Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tarot readings."
    });
  }
});

// Admin: Get all tarot readings
router.get("/", authMiddleware, async (req, res) => {
  try {
    const readings = await Tarot.find().sort({
      date: -1,
      createdAt: -1
    });

    return res.status(200).json({
      success: true,
      readings
    });
  } catch (error) {
    console.error("Get Tarot Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tarot readings."
    });
  }
});

// Admin: Add new tarot reading
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      date,
      cardName,
      subtitle,
      interpretation,
      guidance,
      status
    } = req.body;

    if (!date || !cardName?.trim() || !interpretation?.trim() || !guidance?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Date, card name, interpretation and guidance are required."
      });
    }

    const reading = await Tarot.create({
      date,
      cardName: cardName.trim(),
      subtitle: subtitle?.trim() || "",
      interpretation: interpretation.trim(),
      guidance: guidance.trim(),
      status: status === "Published" ? "Published" : "Draft"
    });

    return res.status(201).json({
      success: true,
      message: "Tarot reading added successfully.",
      reading
    });
  } catch (error) {
    console.error("Create Tarot Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to add tarot reading."
    });
  }
});

// Admin: Update tarot reading
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid tarot reading ID."
      });
    }

    const {
      date,
      cardName,
      subtitle,
      interpretation,
      guidance,
      status
    } = req.body;

    if (!date || !cardName?.trim() || !interpretation?.trim() || !guidance?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Date, card name, interpretation and guidance are required."
      });
    }

    const reading = await Tarot.findByIdAndUpdate(
      id,
      {
        date,
        cardName: cardName.trim(),
        subtitle: subtitle?.trim() || "",
        interpretation: interpretation.trim(),
        guidance: guidance.trim(),
        status: status === "Published" ? "Published" : "Draft"
      },
      { new: true, runValidators: true }
    );

    if (!reading) {
      return res.status(404).json({
        success: false,
        message: "Tarot reading not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tarot reading updated successfully.",
      reading
    });
  } catch (error) {
    console.error("Update Tarot Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update tarot reading."
    });
  }
});

// Admin: Change Draft / Published status
router.patch("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid tarot reading ID."
      });
    }

    if (!["Draft", "Published"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be Draft or Published."
      });
    }

    const reading = await Tarot.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!reading) {
      return res.status(404).json({
        success: false,
        message: "Tarot reading not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tarot status updated successfully.",
      reading
    });
  } catch (error) {
    console.error("Tarot Status Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update tarot status."
    });
  }
});

// Admin: Delete tarot reading
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid tarot reading ID."
      });
    }

    const reading = await Tarot.findByIdAndDelete(id);

    if (!reading) {
      return res.status(404).json({
        success: false,
        message: "Tarot reading not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tarot reading deleted successfully."
    });
  } catch (error) {
    console.error("Delete Tarot Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to delete tarot reading."
    });
  }
});

module.exports = router;
