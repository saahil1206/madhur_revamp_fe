const express = require("express");
const controller = require("./controller");

const router = express.Router();

router.get("/", controller.list);
router.get("/latest", controller.latest);
router.put("/latest", controller.upsertLatest);
router.get("/requests", controller.listRequests);
router.post("/generate", controller.generate);

module.exports = router;
