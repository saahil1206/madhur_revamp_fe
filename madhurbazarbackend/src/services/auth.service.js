const jwt = require("jsonwebtoken");
const md5 = require("md5");
const { randomUUID } = require("crypto");
const { Op } = require("sequelize");
const { jwtSecret } = require("../config/env");
const { UserPersonal, UserAccount } = require("../models");

const ALLOWED_GROUPS = [1, 2, 3, 4, 7];

async function login(username, password) {
  const user = await UserPersonal.findOne({
    where: { username },
    attributes: ["id", "username", "password", "blocked_status", "fullname", "phonenumber", "city", "img"],
  });

  if (!user) {
    return { ok: false, message: "This usernme does not exit" };
  }

  if (user.password !== md5(password)) {
    return { ok: false, message: "This password does not correct" };
  }

  if (Number(user.blocked_status) !== 1) {
    return { ok: false, message: "This account is blocked contact admin" };
  }

  const account = await UserAccount.findOne({
    where: {
      game_user_id: user.id,
      game_group_id: { [Op.in]: ALLOWED_GROUPS },
    },
    attributes: ["game_group_id"],
  });

  if (!account) {
    return { ok: false, message: "something wrong contact admin" };
  }

  const activeSessionId = randomUUID();
  await user.update({ active_session_id: activeSessionId });

  const token = jwt.sign(
    {
      userId: user.id,
      username: user.username,
      accessLevel: account.game_group_id,
      activeSessionId,
    },
    jwtSecret,
    { expiresIn: "7d" }
  );

  return {
    ok: true,
    data: {
      token,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullname || "",
        mobile: user.phonenumber || "",
        city: user.city || "",
        photo: user.img || null,
        accessLevel: account.game_group_id,
      },
    },
  };
}

async function updateProfile(userId, payload = {}) {
  const fullName = String(payload.fullName || "").trim();
  const mobile = String(payload.mobile || "").trim();
  const city = String(payload.city || "").trim();
  const photo = payload.photo;

  if (!fullName || !mobile || !city) {
    return { ok: false, message: "fullName, mobile and city are required" };
  }
  if (!/^[a-zA-Z\s]{3,}$/.test(fullName)) {
    return { ok: false, message: "Invalid full name" };
  }
  if (!/^[6-9]\d{9}$/.test(mobile)) {
    return { ok: false, message: "Enter a valid 10-digit mobile number" };
  }
  if (!/^[a-zA-Z\s]{2,}$/.test(city)) {
    return { ok: false, message: "Invalid city" };
  }
  if (photo !== undefined && photo !== null) {
    const photoText = String(photo);
    const looksLikeDataUrl = /^data:image\/(jpeg|jpg|png|webp|gif);base64,/i.test(photoText);
    if (!looksLikeDataUrl) {
      return { ok: false, message: "Invalid photo format" };
    }
  }

  const user = await UserPersonal.findByPk(userId);
  if (!user) {
    return { ok: false, message: "User not found" };
  }

  const updateData = {
    fullname: fullName,
    phonenumber: mobile,
    city,
  };
  if (photo !== undefined) {
    updateData.img = photo || null;
  }

  await user.update(updateData);

  return {
    ok: true,
    data: {
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullname,
        mobile: user.phonenumber,
        city: user.city,
        photo: user.img || null,
      },
    },
  };
}

async function changePassword(userId, payload = {}) {
  const oldPassword = String(payload.oldPassword || "");
  const newPassword = String(payload.newPassword || "");
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{8,20}$/;

  if (!oldPassword || !newPassword) {
    return { ok: false, message: "oldPassword and newPassword are required" };
  }

  if (!strongPasswordRegex.test(newPassword)) {
    return { ok: false, message: "Password must be 8-20 chars with uppercase, lowercase, number and special character" };
  }

  if (oldPassword === newPassword) {
    return { ok: false, message: "New password must be different from old password" };
  }

  const user = await UserPersonal.findByPk(userId, {
    attributes: ["id", "password"],
  });

  if (!user) {
    return { ok: false, message: "User not found" };
  }

  if (user.password !== md5(oldPassword)) {
    return { ok: false, message: "Old password is incorrect" };
  }

  await user.update({
    password: md5(newPassword),
    active_session_id: randomUUID(),
  });

  return {
    ok: true,
    data: {
      message: "Password changed successfully",
    },
  };
}

module.exports = { login, updateProfile, changePassword };
