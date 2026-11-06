
const express = require("express");
const About = require("../models/About");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const defaultAbout = {
  story: {
    label: "THE STORY OF DIVINE CARAT",
    heading: "Created for moments of pause and possibility.",
    paragraphOne:
      "Life is full of questions, changes and moments when we need space to listen to ourselves. Divine Carat brings together tarot, astrology and thoughtful reflections to create a welcoming space for that journey.",
    paragraphTwo:
      "Our intention is to encourage self-reflection and help you explore your own thoughts with curiosity.",
  },

  philosophy: {
    label: "WHAT WE BELIEVE",
    heading: "A little wonder. A little wisdom.",
    description:
      "We believe that meaningful journeys begin with curiosity and the willingness to understand ourselves.",
    values: [
      {
        title: "Reflection",
        description:
          "Make room for quiet moments, thoughtful questions and a deeper understanding of yourself.",
      },
      {
        title: "Exploration",
        description:
          "Explore tarot and astrology as symbolic tools for discovering fresh perspectives.",
      },
      {
        title: "Self-connection",
        description:
          "Honour your own experiences, feelings and the choices that shape your journey.",
      },
    ],
  },

  approach: {
    label: "OUR APPROACH",
    heading: "Guidance that leaves room for your own path.",
    description:
      "At Divine Carat, tarot and astrology are approached as invitations to reflect, not as fixed answers about your future. Every experience is an opportunity to pause, explore possibilities and make choices that feel right for you.",
  },

  promise: {
    label: "A NOTE FROM DIVINE CARAT",
    heading: "Your story is still unfolding. Let curiosity lead the way.",
    description:
      "Wherever you are in your journey, there is always room for a new perspective.",
  },

  closingQuote: "Your journey is yours to discover.",
};

// Get or create the single About document
const getAboutDocument = async () => {
  let about = await About.findOne();

  if (!about) {
    about = await About.create(defaultAbout);
  }

  return about;
};

// Public About content
router.get("/public", async (req, res) => {
  try {
    const about = await getAboutDocument();

    return res.status(200).json({
      success: true,
      about,
    });
  } catch (error) {
    console.error("Public About Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch About content.",
    });
  }
});

// Admin: Get About content
router.get("/", authMiddleware, async (req, res) => {
  try {
    const about = await getAboutDocument();

    return res.status(200).json({
      success: true,
      about,
    });
  } catch (error) {
    console.error("Admin About Fetch Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch About content.",
    });
  }
});

// Admin: Update About content
router.put("/", authMiddleware, async (req, res) => {
  try {
    const { story, philosophy, approach, promise, closingQuote } = req.body;

    if (
      !story ||
      !philosophy ||
      !approach ||
      !promise ||
      typeof closingQuote !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all About page sections.",
      });
    }

    const about = await getAboutDocument();

    about.story = story;
    about.philosophy = philosophy;
    about.approach = approach;
    about.promise = promise;
    about.closingQuote = closingQuote;

    await about.save();

    return res.status(200).json({
      success: true,
      message: "About page updated successfully.",
      about,
    });
  } catch (error) {
    console.error("Admin About Update Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to update About content.",
    });
  }
});

module.exports = router;
