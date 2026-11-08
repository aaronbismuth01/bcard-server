const User = require("../models/User");
const { generatePassword, comparePassword } = require("../../utils/bcrypt");
const { generateToken } = require("../../utils/token");
const { createError } = require("../../utils/handleErrors");

const MAX_LOGIN_ATTEMPTS = 3;
const BLOCK_DURATION_MS = 24 * 60 * 60 * 1000;
const PUBLIC_FIELDS = "-password -__v";

// Treats empty image fields as "not provided" so mongoose defaults apply
const cleanImage = (image) => {
  if (!image) return undefined;
  const cleaned = {};
  if (image.url) cleaned.url = image.url;
  if (image.alt) cleaned.alt = image.alt;
  return cleaned;
};

const registerUser = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email.toLowerCase() });
  if (existingUser) throw createError(409, "A user with this email already exists");

  const user = new User({
    ...userData,
    image: cleanImage(userData.image),
    password: generatePassword(userData.password),
  });
  await user.save();
  return { _id: user._id, name: user.name, email: user.email };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+loginAttempts +blockedUntil"
  );
  if (!user) throw createError(401, "Invalid email or password");

  if (user.blockedUntil && user.blockedUntil > new Date()) {
    throw createError(403, "User is blocked for 24 hours after 3 failed login attempts");
  }

  if (!comparePassword(password, user.password)) {
    user.loginAttempts += 1;
    if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      user.blockedUntil = new Date(Date.now() + BLOCK_DURATION_MS);
      user.loginAttempts = 0;
    }
    await user.save();
    throw createError(401, "Invalid email or password");
  }

  user.loginAttempts = 0;
  user.blockedUntil = null;
  await user.save();
  return generateToken(user);
};

const getUsers = () => User.find().select(PUBLIC_FIELDS);

const getUser = async (id) => {
  const user = await User.findById(id).select(PUBLIC_FIELDS);
  if (!user) throw createError(404, "User not found");
  return user;
};

const updateUser = async (id, userData) => {
  const user = await User.findByIdAndUpdate(
    id,
    { ...userData, image: cleanImage(userData.image) },
    { new: true, runValidators: true }
  ).select(PUBLIC_FIELDS);
  if (!user) throw createError(404, "User not found");
  return user;
};

const toggleBusinessStatus = async (id) => {
  const user = await User.findById(id).select(PUBLIC_FIELDS);
  if (!user) throw createError(404, "User not found");
  user.isBusiness = !user.isBusiness;
  await user.save();
  return user;
};

const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id).select(PUBLIC_FIELDS);
  if (!user) throw createError(404, "User not found");
  return user;
};

module.exports = {
  registerUser,
  loginUser,
  getUsers,
  getUser,
  updateUser,
  toggleBusinessStatus,
  deleteUser,
};
