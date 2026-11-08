const express = require("express");
const auth = require("../../middlewares/auth");
const service = require("../services/cardsService");
const { cardSchema, bizNumberSchema } = require("../validations/cardValidation");
const { handleError, createError } = require("../../utils/handleErrors");
const { assertValidId, validate } = require("../../utils/validators");

const router = express.Router();

// 1. Get all cards - everyone
router.get("/", async (req, res) => {
  try {
    return res.send(await service.getCards());
  } catch (error) {
    return handleError(res, error);
  }
});

// 2. Get the logged-in user's cards (declared before "/:id" on purpose)
router.get("/my-cards", auth, async (req, res) => {
  try {
    return res.send(await service.getMyCards(req.user._id));
  } catch (error) {
    return handleError(res, error);
  }
});

// 3. Get one card - everyone
router.get("/:id", async (req, res) => {
  try {
    assertValidId(req.params.id);
    return res.send(await service.getCard(req.params.id));
  } catch (error) {
    return handleError(res, error);
  }
});

// 4. Create card - business users only
router.post("/", auth, async (req, res) => {
  try {
    if (!req.user.isBusiness) throw createError(403, "Only a business user can create cards");
    const cardData = validate(cardSchema, req.body);
    const card = await service.createCard(cardData, req.user._id);
    return res.status(201).send(card);
  } catch (error) {
    return handleError(res, error);
  }
});

// 5. Edit card - the user who created it
router.put("/:id", auth, async (req, res) => {
  try {
    assertValidId(req.params.id);
    const cardData = validate(cardSchema, req.body);
    return res.send(await service.updateCard(req.params.id, cardData, req.user._id));
  } catch (error) {
    return handleError(res, error);
  }
});

// 6. Like / unlike card - any registered user
router.patch("/:id", auth, async (req, res) => {
  try {
    assertValidId(req.params.id);
    return res.send(await service.toggleLike(req.params.id, req.user._id));
  } catch (error) {
    return handleError(res, error);
  }
});

// 7. Delete card - the user who created it or an admin
router.delete("/:id", auth, async (req, res) => {
  try {
    assertValidId(req.params.id);
    return res.send(await service.deleteCard(req.params.id, req.user));
  } catch (error) {
    return handleError(res, error);
  }
});

// Bonus: change a card's bizNumber - admin only
router.patch("/biz-number/:id", auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) throw createError(403, "Only an admin can change a business number");
    assertValidId(req.params.id);
    const { bizNumber } = validate(bizNumberSchema, req.body);
    return res.send(await service.changeBizNumber(req.params.id, bizNumber));
  } catch (error) {
    return handleError(res, error);
  }
});

module.exports = router;
