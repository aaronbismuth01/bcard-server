const Joi = require("joi");
const { phone, email, image, address } = require("../../models/common/joiSchemas");

const cardSchema = Joi.object({
  title: Joi.string().min(2).max(256).required(),
  subtitle: Joi.string().min(2).max(256).required(),
  description: Joi.string().min(2).max(1024).required(),
  phone,
  email,
  web: Joi.string().uri().allow(""),
  image,
  address,
});

const bizNumberSchema = Joi.object({
  bizNumber: Joi.number().integer().min(1000000).max(9999999).required(),
});

module.exports = { cardSchema, bizNumberSchema };
