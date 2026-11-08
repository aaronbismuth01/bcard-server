const mongoose = require("mongoose");
const { createError } = require("./handleErrors");

const assertValidId = (id) => {
  if (!mongoose.isValidObjectId(id)) throw createError(400, "Invalid id");
};

// Runs a Joi schema and throws a 400 error with the first validation message
const validate = (schema, data) => {
  const { error, value } = schema.validate(data);
  if (error) throw createError(400, `Validation error: ${error.details[0].message}`);
  return value;
};

module.exports = { assertValidId, validate };
