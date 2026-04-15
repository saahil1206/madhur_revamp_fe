const express = require("express");
const { profileController } = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/profile", authMiddleware, profileController);

module.exports = router;



// const express = require("express");
// const { profileController } = require("../controllers/user.controller");
// const { updateProfileController } = require("../controllers/auth.controller"); // 👈 add this
// const authMiddleware = require("../middlewares/auth.middleware");

// const router = express.Router();

// router.get("/profile", authMiddleware, profileController);

// // ✅ ADD THIS
// // router.put("/profile", authMiddleware, updateProfileController);

// module.exports = router;