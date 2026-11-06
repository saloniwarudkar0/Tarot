
const express = require("express");
const mongoose = require("mongoose");
const Journal = require("../models/Journal");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public: Fetch published articles
router.get("/public", async (req, res) => {
  try {
    const articles = await Journal.find({ status: "Published" })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      articles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch journal articles."
    });
  }
});

// Admin: Fetch all articles
router.get("/", authMiddleware, async (req, res) => {
  try {
    const articles = await Journal.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      articles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch articles."
    });
  }
});

// Admin: Create article
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, slug, category, style, intro, content, status } = req.body;

    if (!title?.trim() || !slug?.trim() || !category?.trim() ||
        !intro?.trim() || !Array.isArray(content) || content.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required article fields."
      });
    }

    const existing = await Journal.findOne({ slug: slug.trim().toLowerCase() });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "This article slug already exists."
      });
    }

    const article = await Journal.create({
      title,
      slug: slug.toLowerCase().trim(),
      category: category.toUpperCase().trim(),
      style,
      intro,
      content,
      status: status || "Draft"
    });

    res.status(201).json({
      success: true,
      message: "Article created successfully.",
      article
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to create article."
    });
  }
});

// Admin: Update article
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid article ID."
      });
    }

    const { title, slug, category, style, intro, content, status } = req.body;

    const article = await Journal.findByIdAndUpdate(
      req.params.id,
      {
        title,
        slug: slug?.toLowerCase().trim(),
        category: category?.toUpperCase().trim(),
        style,
        intro,
        content,
        status
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "Article updated successfully.",
      article
    });
  } catch (error) {
    res.status(error.code === 11000 ? 409 : 500).json({
      success: false,
      message: error.code === 11000
        ? "This article slug already exists."
        : "Unable to update article."
    });
  }
});

// Admin: Change publication status
router.patch("/:id/status", authMiddleware, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid article ID."
      });
    }

    const { status } = req.body;

    if (!["Draft", "Published"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid publication status."
      });
    }

    const article = await Journal.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "Article status updated.",
      article
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to update article status."
    });
  }
});

// Admin: Delete article
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid article ID."
      });
    }

    const article = await Journal.findByIdAndDelete(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "Article deleted successfully."
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to delete article."
    });
  }
});

module.exports = router;
