const jwt = require("jsonwebtoken");
const md5 = require("md5");
const { Op } = require("sequelize");
const { jwtSecret } = require("../config/env");
const { UserPersonal, UserAccount } = require("../models");

const ALLOWED_GROUPS = [1, 2, 3, 4, 7];

async function login(username, password) {
  const user = await UserPersonal.findOne({
    where: { username },
    attributes: ["id", "username", "password", "blocked_status"],
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

  const token = jwt.sign(
    {
      userId: user.id,
      username: user.username,
      accessLevel: account.game_group_id,
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
        accessLevel: account.game_group_id,
      },
    },
  };
}

module.exports = { login };
