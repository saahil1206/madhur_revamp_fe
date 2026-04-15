const express = require("express");
const {
  listResultsController,
  todayResultsController,
  bazarVisibilityController,
} = require("../controllers/result.controller");

const router = express.Router();

router.get("/", listResultsController);
router.get("/today", todayResultsController);
router.get("/bazar/:bazarId/visibility", bazarVisibilityController);

module.exports = router;
