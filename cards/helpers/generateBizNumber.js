const Card = require("../models/Card");
const { createError } = require("../../utils/handleErrors");

const MAX_TRIES = 10;

// Returns a random 7-digit business number that no other card uses
const generateBizNumber = async () => {
  for (let i = 0; i < MAX_TRIES; i += 1) {
    const bizNumber = Math.floor(1000000 + Math.random() * 9000000);
    const exists = await Card.exists({ bizNumber });
    if (!exists) return bizNumber;
  }
  throw createError(500, "Could not generate a unique business number");
};

module.exports = generateBizNumber;
