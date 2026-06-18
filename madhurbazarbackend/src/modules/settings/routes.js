const express = require("express");
const controller = require("./controller");
const authMiddleware = require("../../middlewares/auth.middleware");

const router = express.Router();

router.get("/floating-public", controller.getFloatingPublic);

router.use(authMiddleware);
router.get("/floating", controller.getFloating);
router.put("/floating", controller.updateFloating);

module.exports = router;
