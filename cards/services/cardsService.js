const Card = require("../models/Card");
const generateBizNumber = require("../helpers/generateBizNumber");
const { createError } = require("../../utils/handleErrors");

// Treats empty optional fields as "not provided" so mongoose defaults apply
const cleanCardData = (cardData) => {
  const cleaned = { ...cardData };
  if (!cleaned.web) delete cleaned.web;
  if (cleaned.image) {
    const image = {};
    if (cleaned.image.url) image.url = cleaned.image.url;
    if (cleaned.image.alt) image.alt = cleaned.image.alt;
    cleaned.image = image;
  }
  return cleaned;
};

const findCardOrThrow = async (id) => {
  const card = await Card.findById(id);
  if (!card) throw createError(404, "Card not found");
  return card;
};

const getCards = () => Card.find();

const getMyCards = (userId) => Card.find({ user_id: userId });

const getCard = (id) => findCardOrThrow(id);

const createCard = async (cardData, userId) => {
  const card = new Card({
    ...cleanCardData(cardData),
    bizNumber: await generateBizNumber(),
    user_id: userId,
  });
  return card.save();
};

const updateCard = async (id, cardData, userId) => {
  const card = await findCardOrThrow(id);
  if (card.user_id.toString() !== userId) {
    throw createError(403, "Only the user who created the card can edit it");
  }
  card.set(cleanCardData(cardData));
  return card.save();
};

const toggleLike = async (id, userId) => {
  const card = await findCardOrThrow(id);
  const alreadyLiked = card.likes.includes(userId);
  card.likes = alreadyLiked
    ? card.likes.filter((likeId) => likeId !== userId)
    : [...card.likes, userId];
  return card.save();
};

const deleteCard = async (id, user) => {
  const card = await findCardOrThrow(id);
  if (card.user_id.toString() !== user._id && !user.isAdmin) {
    throw createError(403, "Only the user who created the card or an admin can delete it");
  }
  await card.deleteOne();
  return card;
};

const changeBizNumber = async (id, bizNumber) => {
  const card = await findCardOrThrow(id);
  const takenBy = await Card.findOne({ bizNumber, _id: { $ne: id } });
  if (takenBy) throw createError(409, "This business number is already taken");
  card.bizNumber = bizNumber;
  return card.save();
};

module.exports = {
  getCards,
  getMyCards,
  getCard,
  createCard,
  updateCard,
  toggleLike,
  deleteCard,
  changeBizNumber,
};
