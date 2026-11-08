const morgan = require("morgan");

const getTimestamp = () => new Date().toISOString().replace("T", " ").slice(0, 19);

// Example: [2026-10-28 14:05:12] GET /cards 200 - 12.345 ms
const morganLogger = morgan((tokens, req, res) =>
  [
    `[${getTimestamp()}]`,
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    "-",
    tokens["response-time"](req, res),
    "ms",
  ].join(" ")
);

module.exports = morganLogger;
