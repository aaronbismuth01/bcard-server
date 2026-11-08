const mongoose = require("mongoose");
const { DEFAULT_STRING, Image, Address } = require("../../models/common/schemas");
const { PHONE, EMAIL, URL } = require("../../models/common/regex");

const cardSchema = new mongoose.Schema({
  title: { ...DEFAULT_STRING, required: true },
  subtitle: { ...DEFAULT_STRING, required: true },
  description: { ...DEFAULT_STRING, required: true, maxLength: 1024 },
  phone: { type: String, required: true, match: PHONE },
  email: { type: String, required: true, match: EMAIL, lowercase: true, trim: true },
  web: { type: String, trim: true, match: URL },
  image: { type: Image, default: () => ({}) },
  address: { type: Address, required: true },
  bizNumber: { type: Number, required: true, unique: true, min: 1000000, max: 9999999 },
  likes: [String],
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  createdAt: { type: Date, default: Date.now },
});

const Card = mongoose.model("card", cardSchema);

module.exports = Card;
