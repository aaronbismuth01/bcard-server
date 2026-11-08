const Joi = require("joi");
const { PASSWORD } = require("../../models/common/regex");
const { phone, email, image, address } = require("../../models/common/joiSchemas");

const name = Joi.object({
  first: Joi.string().min(2).max(256).required(),
  middle: Joi.string().max(256).allow(""),
  last: Joi.string().min(2).max(256).required(),
}).required();

const password = Joi.string()
  .pattern(PASSWORD)
  .message(
    '"password" must be 7-20 characters with an uppercase letter, a lowercase letter, a number and one of !@#$%^&*-_'
  )
  .required();

const registerSchema = Joi.object({
  name,
  isBusiness: Joi.boolean().required(),
  phone,
  email,
  password,
  address,
  image,
});

const loginSchema = Joi.object({ email, password: Joi.string().required() });

// Email, password, isBusiness and isAdmin cannot be changed through PUT
const updateUserSchema = Joi.object({ name, phone, address, image });

module.exports = { registerSchema, loginSchema, updateUserSchema };
