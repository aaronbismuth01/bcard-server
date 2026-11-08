const mongoose = require("mongoose");
const { Name, Image, Address } = require("../../models/common/schemas");
const { PHONE, EMAIL } = require("../../models/common/regex");

const userSchema = new mongoose.Schema({
  name: { type: Name, required: true },
  phone: { type: String, required: true, match: PHONE },
  email: { type: String, required: true, match: EMAIL, lowercase: true, trim: true, unique: true },
  password: { type: String, required: true, trim: true },
  image: { type: Image, default: () => ({}) },
  address: { type: Address, required: true },
  isAdmin: { type: Boolean, default: false },
  isBusiness: { type: Boolean, default: false },
  // Used to block a user after 3 consecutive failed logins (bonus)
  loginAttempts: { type: Number, default: 0, select: false },
  blockedUntil: { type: Date, default: null, select: false },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
