const express = require("express");
const { loginController, updateProfileController } = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/login", loginController);
router.put("/update-profile", authMiddleware, updateProfileController);

module.exports = router;
