const express = require("express");
const controller = require("./controller");
const authMiddleware = require("../../middlewares/auth.middleware");

const router = express.Router();

router.use(authMiddleware);
router.get("/sites", controller.sites);
router.get("/entry", controller.getEntry);
router.post("/entry", controller.upsertEntry);

module.exports = router;
