const { login, updateProfile, changePassword } = require("../services/auth.service");

async function loginController(req, res) {
  try {
    const { userName, passWord } = req.body;

    if (!userName || !passWord) {
      return res.status(400).json({
        message: "userName and passWord are required",
      });
    }

    const result = await login(userName, passWord);
    if (!result.ok) {
      return res.status(401).json({ message: result.message });
    }

    return res.json(result.data);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function updateProfileController(req, res) {
  try {
    const result = await updateProfile(req.user.userId, req.body || {});
    if (!result.ok) {
      const status = result.message === "User not found" ? 404 : 400;
      return res.status(status).json({ message: result.message });
    }

    return res.json(result.data);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function changePasswordController(req, res) {
  try {
    const result = await changePassword(req.user.userId, req.body || {});
    if (!result.ok) {
      const badRequestMessages = [
        "oldPassword and newPassword are required",
        "Password must be 8-20 chars with uppercase, lowercase, number and special character",
        "New password must be different from old password",
        "Old password is incorrect",
      ];
      const status = result.message === "User not found" ? 404 : badRequestMessages.includes(result.message) ? 400 : 500;
      return res.status(status).json({ message: result.message });
    }

    return res.json(result.data);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { loginController, updateProfileController, changePasswordController };
