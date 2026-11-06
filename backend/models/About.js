
const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema(
  {
    story: {
      label: { type: String, default: "THE STORY OF DIVINE CARAT" },
      heading: { type: String, default: "Created for moments of pause and possibility." },
      paragraphOne: {
        type: String,
        default:
          "Life is full of questions, changes and moments when we need space to listen to ourselves. Divine Carat brings together tarot, astrology and thoughtful reflections to create a welcoming space for that journey.",
      },
      paragraphTwo: {
        type: String,
        default:
          "Our intention is to encourage self-reflection and help you explore your own thoughts with curiosity.",
      },
    },

    philosophy: {
      label: { type: String, default: "WHAT WE BELIEVE" },
      heading: { type: String, default: "A little wonder. A little wisdom." },
      description: {
        type: String,
        default:
          "We believe that meaningful journeys begin with curiosity and the willingness to understand ourselves.",
      },
      values: [
        {
          title: String,
          description: String,
        },
      ],
    },

    approach: {
      label: { type: String, default: "OUR APPROACH" },
      heading: {
        type: String,
        default: "Guidance that leaves room for your own path.",
      },
      description: {
        type: String,
        default:
          "At Divine Carat, tarot and astrology are approached as invitations to reflect, not as fixed answers about your future. Every experience is an opportunity to pause, explore possibilities and make choices that feel right for you.",
      },
    },

    promise: {
      label: { type: String, default: "A NOTE FROM DIVINE CARAT" },
      heading: {
        type: String,
        default: "Your story is still unfolding. Let curiosity lead the way.",
      },
      description: {
        type: String,
        default:
          "Wherever you are in your journey, there is always room for a new perspective.",
      },
    },

    closingQuote: {
      type: String,
      default: "Your journey is yours to discover.",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("About", aboutSchema);

