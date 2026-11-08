const jwt = require("jsonwebtoken");

const getSecret = () => process.env.JWT_SECRET;

const generateToken = (user) =>
  jwt.sign(
    { _id: user._id, isBusiness: user.isBusiness, isAdmin: user.isAdmin },
    getSecret(),
    { expiresIn: "1d" }
  );

const verifyToken = (token) => {
  try {
    return jwt.verify(token, getSecret());
  } catch {
    return null;
  }
};

module.exports = { generateToken, verifyToken };
