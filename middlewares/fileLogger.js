const fs = require("fs");
const path = require("path");

const LOGS_DIR = path.join(__dirname, "..", "logs");

const writeErrorLog = (status, message) => {
  const now = new Date();
  const fileName = `${now.toISOString().slice(0, 10)}.log`;
  const line = `${now.toISOString()} | status: ${status} | message: ${message}\n`;

  fs.mkdir(LOGS_DIR, { recursive: true }, (dirError) => {
    if (dirError) return;
    fs.appendFile(path.join(LOGS_DIR, fileName), line, () => {});
  });
};

// Wraps res.send so every response with status >= 400 is written to logs/<date>.log
const fileLogger = (req, res, next) => {
  const originalSend = res.send;

  res.send = function (body) {
    if (res.statusCode >= 400) {
      const message = typeof body === "string" ? body : JSON.stringify(body);
      writeErrorLog(res.statusCode, message);
    }
    return originalSend.call(this, body);
  };

  next();
};

module.exports = fileLogger;
