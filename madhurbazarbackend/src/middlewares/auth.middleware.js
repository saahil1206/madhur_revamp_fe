const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/env");
const { UserPersonal } = require("../models");

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, jwtSecret);
    const user = await UserPersonal.findByPk(decoded.userId, {
      attributes: ["id", "active_session_id", "blocked_status"],
    });

    if (!user || Number(user.blocked_status) !== 1) {
      return res.status(401).json({ message: "Account is no longer active" });
    }

    if (!decoded.activeSessionId || user.active_session_id !== decoded.activeSessionId) {
      return res.status(401).json({ message: "Session expired. Logged in from another browser." });
    }

    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Token expired or invalid" });
  }
}

module.exports = authMiddleware;
