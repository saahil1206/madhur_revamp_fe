const { getProfile } = require("../services/user.service");

async function profileController(req, res) {
  try {
    const profile = await getProfile(req.user.userId);
    if (!profile) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("profile,profile",profile)
    return res.json(profile);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { profileController };
