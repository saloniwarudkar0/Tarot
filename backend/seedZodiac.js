require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Zodiac = require("./models/Zodiac");

const zodiacSigns = [
  {
    name: "Aries",
    slug: "aries",
    symbol: "♈",
    dates: "March 21 – April 19",
    element: "Fire",
    planet: "Mars",
    quality: "Cardinal",
    color: "Warm Red",
    traits: "Courageous, energetic, confident and adventurous.",
    strengths: "Leadership, determination, enthusiasm and honesty.",
    weaknesses: "Impatience, impulsiveness and a short temper.",
    love: "Aries values excitement, honesty and independence in love.",
    career: "Often drawn to leadership, entrepreneurship and challenging work.",
    about: "Aries is the first sign of the zodiac, traditionally associated with fresh beginnings, courage and taking initiative."
  },
  {
    name: "Taurus",
    slug: "taurus",
    symbol: "♉",
    dates: "April 20 – May 20",
    element: "Earth",
    planet: "Venus",
    quality: "Fixed",
    color: "Green",
    traits: "Patient, reliable, grounded and affectionate.",
    strengths: "Loyalty, patience, determination and practicality.",
    weaknesses: "Stubbornness, possessiveness and resistance to change.",
    love: "Taurus values stability, trust and meaningful affection.",
    career: "Often drawn to finance, design, art and dependable work.",
    about: "Taurus is associated with comfort, stability, beauty and an appreciation for life's simple pleasures."
  },
  {
    name: "Gemini",
    slug: "gemini",
    symbol: "♊",
    dates: "May 21 – June 20",
    element: "Air",
    planet: "Mercury",
    quality: "Mutable",
    color: "Yellow",
    traits: "Curious, expressive, adaptable and social.",
    strengths: "Communication, creativity, curiosity and versatility.",
    weaknesses: "Restlessness, indecisiveness and inconsistency.",
    love: "Gemini values communication, humour and mental connection.",
    career: "Often drawn to writing, media, teaching and communication.",
    about: "Gemini represents curiosity, ideas and the desire to explore different perspectives."
  },
  {
    name: "Cancer",
    slug: "cancer",
    symbol: "♋",
    dates: "June 21 – July 22",
    element: "Water",
    planet: "Moon",
    quality: "Cardinal",
    color: "Silver",
    traits: "Sensitive, caring, intuitive and protective.",
    strengths: "Empathy, loyalty, imagination and compassion.",
    weaknesses: "Moodiness, overthinking and sensitivity.",
    love: "Cancer values emotional security, affection and deep trust.",
    career: "Often drawn to caregiving, hospitality, education and creative work.",
    about: "Cancer is traditionally connected with home, emotions, nurturing and a strong sense of belonging."
  },
  {
    name: "Leo",
    slug: "leo",
    symbol: "♌",
    dates: "July 23 – August 22",
    element: "Fire",
    planet: "Sun",
    quality: "Fixed",
    color: "Gold",
    traits: "Confident, generous, expressive and passionate.",
    strengths: "Creativity, courage, warmth and leadership.",
    weaknesses: "Pride, stubbornness and desire for attention.",
    love: "Leo values romance, appreciation and wholehearted affection.",
    career: "Often drawn to leadership, entertainment, performance and creative fields.",
    about: "Leo is associated with self-expression, confidence, generosity and the joy of being creative."
  },
  {
    name: "Virgo",
    slug: "virgo",
    symbol: "♍",
    dates: "August 23 – September 22",
    element: "Earth",
    planet: "Mercury",
    quality: "Mutable",
    color: "Olive Green",
    traits: "Practical, thoughtful, observant and organised.",
    strengths: "Attention to detail, reliability and problem-solving.",
    weaknesses: "Perfectionism, worry and being overly critical.",
    love: "Virgo values consistency, thoughtful gestures and mutual respect.",
    career: "Often drawn to research, healthcare, analysis and organisation.",
    about: "Virgo represents careful observation, practical wisdom and a desire to improve everyday life."
  },
  {
    name: "Libra",
    slug: "libra",
    symbol: "♎",
    dates: "September 23 – October 22",
    element: "Air",
    planet: "Venus",
    quality: "Cardinal",
    color: "Pastel Pink",
    traits: "Diplomatic, charming, balanced and thoughtful.",
    strengths: "Fairness, cooperation, grace and social awareness.",
    weaknesses: "Indecisiveness, people-pleasing and avoiding conflict.",
    love: "Libra values harmony, partnership and meaningful conversation.",
    career: "Often drawn to law, design, diplomacy and public relations.",
    about: "Libra is traditionally associated with balance, beauty, fairness and relationships."
  },
  {
    name: "Scorpio",
    slug: "scorpio",
    symbol: "♏",
    dates: "October 23 – November 21",
    element: "Water",
    planet: "Pluto",
    quality: "Fixed",
    color: "Deep Red",
    traits: "Intense, determined, private and intuitive.",
    strengths: "Loyalty, resilience, focus and emotional depth.",
    weaknesses: "Jealousy, secrecy and possessiveness.",
    love: "Scorpio values honesty, emotional depth and complete trust.",
    career: "Often drawn to research, psychology, investigation and strategy.",
    about: "Scorpio is connected with transformation, emotional depth and personal strength."
  },
  {
    name: "Sagittarius",
    slug: "sagittarius",
    symbol: "♐",
    dates: "November 22 – December 21",
    element: "Fire",
    planet: "Jupiter",
    quality: "Mutable",
    color: "Purple",
    traits: "Optimistic, adventurous, honest and independent.",
    strengths: "Open-mindedness, enthusiasm and curiosity.",
    weaknesses: "Impatience, bluntness and restlessness.",
    love: "Sagittarius values freedom, honesty and shared adventures.",
    career: "Often drawn to travel, education, publishing and exploration.",
    about: "Sagittarius represents exploration, optimism, learning and the search for meaning."
  },
  {
    name: "Capricorn",
    slug: "capricorn",
    symbol: "♑",
    dates: "December 22 – January 19",
    element: "Earth",
    planet: "Saturn",
    quality: "Cardinal",
    color: "Brown",
    traits: "Disciplined, ambitious, patient and responsible.",
    strengths: "Determination, organisation and long-term planning.",
    weaknesses: "Pessimism, rigidity and overworking.",
    love: "Capricorn values commitment, reliability and lasting relationships.",
    career: "Often drawn to management, business, finance and administration.",
    about: "Capricorn is associated with ambition, responsibility and steadily working toward long-term goals."
  },
  {
    name: "Aquarius",
    slug: "aquarius",
    symbol: "♒",
    dates: "January 20 – February 18",
    element: "Air",
    planet: "Uranus",
    quality: "Fixed",
    color: "Electric Blue",
    traits: "Original, independent, thoughtful and inventive.",
    strengths: "Innovation, individuality and humanitarian thinking.",
    weaknesses: "Detachment, unpredictability and stubbornness.",
    love: "Aquarius values friendship, individuality and intellectual connection.",
    career: "Often drawn to technology, science, innovation and social causes.",
    about: "Aquarius represents originality, progressive ideas and a desire to think beyond convention."
  },
  {
    name: "Pisces",
    slug: "pisces",
    symbol: "♓",
    dates: "February 19 – March 20",
    element: "Water",
    planet: "Neptune",
    quality: "Mutable",
    color: "Sea Green",
    traits: "Imaginative, compassionate, intuitive and gentle.",
    strengths: "Creativity, empathy, imagination and kindness.",
    weaknesses: "Escapism, over-sensitivity and indecision.",
    love: "Pisces values emotional connection, tenderness and understanding.",
    career: "Often drawn to art, music, healing and creative professions.",
    about: "Pisces is traditionally connected with imagination, compassion, intuition and emotional expression."
  }
];

const seedZodiac = async () => {
  try {
    await connectDB();

    for (const sign of zodiacSigns) {
      await Zodiac.findOneAndUpdate(
        { slug: sign.slug },
        {
          $set: {
            ...sign,
            status: "Published"
          }
        },
        {
          upsert: true,
          new: true,
          runValidators: true,
          setDefaultsOnInsert: true
        }
      );

      console.log(`${sign.name} saved successfully.`);
    }

    console.log("All 12 zodiac signs seeded successfully.");
  } catch (error) {
    console.error("Zodiac seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedZodiac();