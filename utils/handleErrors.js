const createError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const handleError = (res, error) => {
  const status = error.status || 500;
  const message = error.status ? error.message : "Internal server error";
  if (!error.status) console.error(error);
  return res.status(status).send(message);
};

module.exports = { createError, handleError };
