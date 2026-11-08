const bcrypt = require("bcryptjs");

const generatePassword = (password) => bcrypt.hashSync(password, 10);

const comparePassword = (password, hashedPassword) =>
  bcrypt.compareSync(password, hashedPassword);

module.exports = { generatePassword, comparePassword };
