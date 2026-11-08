require("dotenv").config();
const express = require("express");
const cors = require("./middlewares/cors");
const morganLogger = require("./middlewares/morganLogger");
const fileLogger = require("./middlewares/fileLogger");
const router = require("./router/router");
const { handleError, createError } = require("./utils/handleErrors");
const connectToDb = require("./config/db");
const generateInitialData = require("./initialData/initialDataService");

const app = express();
const PORT = process.env.PORT || 8181;

app.use(cors);
app.use(morganLogger);
app.use(fileLogger);
app.use(express.json());

app.use(router);

app.use((req, res) => handleError(res, createError(404, "Page not found")));

// Catches malformed JSON bodies and any unexpected error
app.use((error, req, res, next) => {
  if (error.type === "entity.parse.failed") {
    return handleError(res, createError(400, "Invalid JSON in request body"));
  }
  return handleError(res, error);
});

const startServer = async () => {
  await connectToDb();
  await generateInitialData();
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
};

startServer();
