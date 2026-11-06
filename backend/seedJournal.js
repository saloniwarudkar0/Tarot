
require("dotenv").config();

const mongoose = require("mongoose");
const Journal = require("./models/Journal");

const articles = [
  {
    slug: "self-reflection",
    title: "Learning to trust the quiet voice within",
    category: "SELF REFLECTION",
    style: "journal-moon",
    intro: "Sometimes the answers we seek begin with a quiet moment of listening.",
    content: [
      {
        heading: "Make space for silence",
        text: "Life can become so busy that we forget to listen to ourselves. Between responsibilities, expectations and everyday noise, our own thoughts can become difficult to hear. Taking a moment to pause can help us reconnect with what truly matters."
      },
      {
        heading: "Trust your inner voice",
        text: "Your intuition does not always arrive as a loud answer. Sometimes it is a gentle feeling, a moment of clarity or a quiet sense that something is right for you. Give yourself permission to notice those feelings without rushing."
      },
      {
        heading: "A thought to carry with you",
        text: "You do not need to have every answer today. Allow yourself time, be patient with your journey and remember that understanding often begins when you make room to listen."
      }
    ],
    status: "Published"
  },
  {
    slug: "personal-growth",
    title: "Making room for a beautiful new beginning",
    category: "PERSONAL GROWTH",
    style: "journal-sun",
    intro: "Every new beginning starts with the courage to make room for change.",
    content: [
      {
        heading: "Let yourself grow",
        text: "Growth is not always a dramatic transformation. It can begin with a small decision, a new habit or the willingness to see something differently. Every step forward matters."
      },
      {
        heading: "Release what no longer serves you",
        text: "Sometimes moving forward means letting go of old expectations, limiting beliefs and things that no longer feel aligned with who you are becoming. You are allowed to change."
      },
      {
        heading: "Welcome what comes next",
        text: "A new beginning does not require a perfect plan. Start where you are, take one thoughtful step and remain open to the possibilities ahead."
      }
    ],
    status: "Published"
  },
  {
    slug: "inspiration",
    title: "Finding hope in the journey of life",
    category: "INSPIRATION",
    style: "journal-star",
    intro: "Even during uncertain moments, there is always room for hope.",
    content: [
      {
        heading: "Every journey has its seasons",
        text: "Some chapters feel bright and full of possibility, while others ask us to slow down and find our strength. Both are part of becoming who we are."
      },
      {
        heading: "Notice the little things",
        text: "Hope can be found in unexpected places: a kind word, a quiet morning, a new opportunity or the simple courage to try again. Small moments can bring meaningful light."
      },
      {
        heading: "Keep believing in your journey",
        text: "You may not know exactly where the road leads, and that is okay. Keep moving with patience, curiosity and trust in the possibilities still waiting for you."
      }
    ],
    status: "Published"
  }
];

async function seedJournal() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in backend/.env");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for Journal seeding.");

    let inserted = 0;
    let skipped = 0;

    for (const article of articles) {
      const existing = await Journal.findOne({ slug: article.slug });

      if (existing) {
        skipped++;
        console.log(`Skipped existing article: ${article.slug}`);
        continue;
      }

      await Journal.create(article);
      inserted++;
      console.log(`Inserted article: ${article.slug}`);
    }

    console.log(`Journal seed completed. Inserted: ${inserted}, skipped: ${skipped}`);
  } catch (error) {
    console.error("Journal seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedJournal();
