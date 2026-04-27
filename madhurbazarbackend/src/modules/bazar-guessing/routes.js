const express = require("express");
const controller = require("./controller");
const authMiddleware = require("../../middlewares/auth.middleware");

const router = express.Router();

router.get("/", controller.list);
router.put("/", authMiddleware, controller.upsertBulk);

module.exports = router;
