
require("dotenv").config();

const connectDB = require("./config/db");
const Tarot = require("./models/Tarot");

const seedTarot = async () => {
  try {
    await connectDB();

    const existingReading = await Tarot.findOne({
      cardName: "The Star"
    });

    if (existingReading) {
      console.log("The Star reading already exists. Skipping.");
    } else {
      await Tarot.create({
        date: new Date().toISOString().slice(0, 10),
        cardName: "The Star",
        subtitle: "Hope • Healing • Renewal",
        interpretation:
          "The Star brings a message of hope, calmness and renewed faith. Trust the journey and allow yourself time to heal.",
        guidance:
          "Take a quiet moment today. Release old worries and focus on the possibilities ahead.",
        status: "Published"
      });

      console.log("The Star reading inserted successfully.");
    }

    console.log("Tarot seeding completed.");
    process.exit(0);
  } catch (error) {
    console.error("Tarot seeding failed:", error.message);
    process.exit(1);
  }
};

seedTarot();
