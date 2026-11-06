const express = require("express");
const mongoose = require("mongoose");
const Zodiac = require("../models/Zodiac");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const zodiacFields = [
  "name",
  "slug",
  "symbol",
  "dates",
  "element",
  "planet",
  "quality",
  "color",
  "traits",
  "strengths",
  "weaknesses",
  "love",
  "career",
  "about"
];

function prepareZodiacData(body) {
  const data = {};

  zodiacFields.forEach((field) => {
    if (typeof body[field] === "string") {
      data[field] = body[field].trim();
    }
  });

  if (data.name && !data.slug) {
    data.slug = data.name.toLowerCase().replace(/\s+/g, "-");
  }

  if (body.status !== undefined) {
    data.status = body.status === "Published" ? "Published" : "Draft";
  }

  return data;
}

function validateZodiac(data) {
  return zodiacFields.every(
    (field) =>
      typeof data[field] === "string" &&
      data[field].trim().length > 0
  );
}

// Public: Get all published zodiac signs
router.get("/public", async (req, res) => {
  try {
    const signs = await Zodiac.find({ status: "Published" })
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      signs
    });
  } catch (error) {
    console.error("Public Zodiac Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch zodiac signs."
    });
  }
});

// Public: Get one published zodiac sign
router.get("/public/:slug", async (req, res) => {
  try {
    const sign = await Zodiac.findOne({
      slug: req.params.slug.toLowerCase(),
      status: "Published"
    });

    if (!sign) {
      return res.status(404).json({
        success: false,
        message: "Zodiac sign not found."
      });
    }

    return res.status(200).json({
      success: true,
      sign
    });
  } catch (error) {
    console.error("Public Zodiac Detail Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch zodiac details."
    });
  }
});

// Admin: Get all zodiac signs
router.get("/", authMiddleware, async (req, res) => {
  try {
    const signs = await Zodiac.find().sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      signs
    });
  } catch (error) {
    console.error("Get Zodiac Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch zodiac signs."
    });
  }
});

// Admin: Add zodiac sign
router.post("/", authMiddleware, async (req, res) => {
  try {
    const data = prepareZodiacData(req.body);

    if (!validateZodiac(data)) {
      return res.status(400).json({
        success: false,
        message: "All zodiac fields are required."
      });
    }

    const sign = await Zodiac.create({
      ...data,
      status: data.status || "Draft"
    });

    return res.status(201).json({
      success: true,
      message: "Zodiac sign added successfully.",
      sign
    });
  } catch (error) {
    console.error("Create Zodiac Error:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This zodiac sign or slug already exists."
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to add zodiac sign."
    });
  }
});

// Admin: Update zodiac sign
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid zodiac ID."
      });
    }

    const data = prepareZodiacData(req.body);

    if (!validateZodiac(data)) {
      return res.status(400).json({
        success: false,
        message: "All zodiac fields are required."
      });
    }

    const sign = await Zodiac.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );

    if (!sign) {
      return res.status(404).json({
        success: false,
        message: "Zodiac sign not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Zodiac sign updated successfully.",
      sign
    });
  } catch (error) {
    console.error("Update Zodiac Error:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This zodiac sign or slug already exists."
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update zodiac sign."
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
        message: "Invalid zodiac ID."
      });
    }

    if (!["Draft", "Published"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be Draft or Published."
      });
    }

    const sign = await Zodiac.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!sign) {
      return res.status(404).json({
        success: false,
        message: "Zodiac sign not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Zodiac status updated successfully.",
      sign
    });
  } catch (error) {
    console.error("Zodiac Status Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update zodiac status."
    });
  }
});

// Admin: Delete zodiac sign
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid zodiac ID."
      });
    }

    const sign = await Zodiac.findByIdAndDelete(id);

    if (!sign) {
      return res.status(404).json({
        success: false,
        message: "Zodiac sign not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Zodiac sign deleted successfully."
    });
  } catch (error) {
    console.error("Delete Zodiac Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to delete zodiac sign."
    });
  }
});

module.exports = router;