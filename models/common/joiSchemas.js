const Joi = require("joi");
const { PHONE, EMAIL } = require("./regex");

const phone = Joi.string()
  .pattern(PHONE)
  .message('"phone" must be a valid Israeli phone number')
  .required();

const email = Joi.string()
  .pattern(EMAIL)
  .message('"email" must be a valid email address')
  .required();

const image = Joi.object({
  url: Joi.string().uri().allow(""),
  alt: Joi.string().min(2).max(256).allow(""),
});

const address = Joi.object({
  state: Joi.string().allow(""),
  country: Joi.string().min(2).max(256).required(),
  city: Joi.string().min(2).max(256).required(),
  street: Joi.string().min(2).max(256).required(),
  houseNumber: Joi.number().integer().min(1).required(),
  zip: Joi.number().integer().min(0).allow(""),
}).required();

module.exports = { phone, email, image, address };
