const bcrypt = require("bcryptjs");

async function generateHash() {
  const password = "Tarot@99";

  const hash = await bcrypt.hash(password, 10);

  console.log("\nGenerated bcrypt hash:\n");
  console.log(hash);
}

generateHash();