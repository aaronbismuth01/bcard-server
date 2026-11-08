const mongoose = require("mongoose");
const { URL } = require("./regex");

const DEFAULT_STRING = { type: String, trim: true, minLength: 2, maxLength: 256 };

const Name = new mongoose.Schema({
  first: { ...DEFAULT_STRING, required: true },
  middle: { type: String, trim: true, maxLength: 256, default: "" },
  last: { ...DEFAULT_STRING, required: true },
});

const Image = new mongoose.Schema({
  url: {
    type: String,
    trim: true,
    match: URL,
    default: "https://cdn.pixabay.com/photo/2016/04/01/10/11/avatar-1299805_960_720.png",
  },
  alt: { type: String, trim: true, maxLength: 256, default: "business card image" },
});

const Address = new mongoose.Schema({
  state: { type: String, trim: true, maxLength: 256, default: "not defined" },
  country: { ...DEFAULT_STRING, required: true },
  city: { ...DEFAULT_STRING, required: true },
  street: { ...DEFAULT_STRING, required: true },
  houseNumber: { type: Number, required: true, min: 1 },
  zip: { type: Number, default: 0 },
});

module.exports = { DEFAULT_STRING, Name, Image, Address };
