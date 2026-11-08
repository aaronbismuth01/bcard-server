const User = require("../users/models/User");
const Card = require("../cards/models/Card");
const generateBizNumber = require("../cards/helpers/generateBizNumber");
const { generatePassword } = require("../utils/bcrypt");
const { users, cards } = require("./initialData");

// Creates 3 users (regular, business, admin) and 3 cards, only when the database is empty
const generateInitialData = async () => {
  try {
    if ((await User.countDocuments()) > 0) return;

    const createdUsers = await User.insertMany(
      users.map((user) => ({ ...user, password: generatePassword(user.password) }))
    );
    const businessUser = createdUsers[1];

    for (const card of cards) {
      await Card.create({
        ...card,
        bizNumber: await generateBizNumber(),
        user_id: businessUser._id,
      });
    }

    console.log("Initial data created: 3 users and 3 cards");
  } catch (error) {
    console.error(`Could not create initial data: ${error.message}`);
  }
};

module.exports = generateInitialData;
