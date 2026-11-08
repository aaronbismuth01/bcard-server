const { verifyToken } = require("../utils/token");
const { handleError, createError } = require("../utils/handleErrors");

// Requires a valid token in the "x-auth-token" header and exposes its payload as req.user
const auth = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) return handleError(res, createError(401, "Please log in"));

  const payload = verifyToken(token);
  if (!payload) return handleError(res, createError(401, "Invalid or expired token"));

  req.user = payload;
  return next();
};

module.exports = auth;
