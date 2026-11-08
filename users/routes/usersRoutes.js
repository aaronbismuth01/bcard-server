const express = require("express");
const auth = require("../../middlewares/auth");
const service = require("../services/usersService");
const { registerSchema, loginSchema, updateUserSchema } = require("../validations/userValidation");
const { handleError, createError } = require("../../utils/handleErrors");
const { assertValidId, validate } = require("../../utils/validators");

const router = express.Router();

const isOwner = (req) => req.user._id === req.params.id;

// 1. Register user
router.post("/", async (req, res) => {
  try {
    const userData = validate(registerSchema, req.body);
    const user = await service.registerUser(userData);
    return res.status(201).send(user);
  } catch (error) {
    return handleError(res, error);
  }
});

// 2. Login - returns an encrypted token
router.post("/login", async (req, res) => {
  try {
    const credentials = validate(loginSchema, req.body);
    const token = await service.loginUser(credentials);
    return res.send(token);
  } catch (error) {
    return handleError(res, error);
  }
});

// 3. Get all users - admin only
router.get("/", auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) throw createError(403, "Only an admin can see all users");
    return res.send(await service.getUsers());
  } catch (error) {
    return handleError(res, error);
  }
});

// 4. Get user - the registered user or admin
router.get("/:id", auth, async (req, res) => {
  try {
    assertValidId(req.params.id);
    if (!isOwner(req) && !req.user.isAdmin) {
      throw createError(403, "You can only see your own details");
    }
    return res.send(await service.getUser(req.params.id));
  } catch (error) {
    return handleError(res, error);
  }
});

// 5. Edit user - the registered user
router.put("/:id", auth, async (req, res) => {
  try {
    assertValidId(req.params.id);
    if (!isOwner(req)) throw createError(403, "You can only edit your own details");
    const userData = validate(updateUserSchema, req.body);
    return res.send(await service.updateUser(req.params.id, userData));
  } catch (error) {
    return handleError(res, error);
  }
});

// 6. Toggle isBusiness - the registered user
router.patch("/:id", auth, async (req, res) => {
  try {
    assertValidId(req.params.id);
    if (!isOwner(req)) throw createError(403, "You can only change your own business status");
    return res.send(await service.toggleBusinessStatus(req.params.id));
  } catch (error) {
    return handleError(res, error);
  }
});

// 7. Delete user - the registered user or admin
router.delete("/:id", auth, async (req, res) => {
  try {
    assertValidId(req.params.id);
    if (!isOwner(req) && !req.user.isAdmin) {
      throw createError(403, "You can only delete your own account");
    }
    return res.send(await service.deleteUser(req.params.id));
  } catch (error) {
    return handleError(res, error);
  }
});

module.exports = router;
