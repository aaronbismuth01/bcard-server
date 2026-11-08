const express = require("express");
const usersRoutes = require("../users/routes/usersRoutes");
const cardsRoutes = require("../cards/routes/cardsRoutes");

const router = express.Router();

router.use("/users", usersRoutes);
router.use("/cards", cardsRoutes);

module.exports = router;
