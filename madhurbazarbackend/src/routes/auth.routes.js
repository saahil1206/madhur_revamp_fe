const express = require("express");
const { loginController, updateProfileController, changePasswordController } = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/login", loginController);
 router.put("/update-profile", authMiddleware, updateProfileController);
router.put("/change-password", authMiddleware, changePasswordController);

module.exports = router;
