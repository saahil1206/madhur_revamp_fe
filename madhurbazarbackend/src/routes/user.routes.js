const express = require("express");
const { profileController } = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/profile", authMiddleware, profileController);

module.exports = router;
