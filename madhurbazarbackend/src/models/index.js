const sequelize = require("../config/database");
const UserPersonal = require("./userPersonal.model");
const UserAccount = require("./userAccount.model");
const GameResult = require("./gameResult.model");
const GameBazar = require("./gameBazar.model");
const LuckyNumber = require("./luckyNumber.model");
const LuckyNumberRequest = require("./luckyNumberRequest.model");
const Notice = require("./notice.model");
const GameUserBazar = require("./gameUserBazar.model");
const GameBazarDay = require("./gameBazarDay.model");
const GameTicket = require("./gameTicket.model");
const UserPassbook = require("./userPassbook.model");
const GameUserCommission = require("./gameUserCommission.model");
const BazarGuessing = require("./bazarGuessing.model");

UserPersonal.hasOne(UserAccount, {
  foreignKey: "game_user_id",
  sourceKey: "id",
  as: "account",
});
UserAccount.belongsTo(UserPersonal, {
  foreignKey: "game_user_id",
  targetKey: "id",
  as: "personal",
});

GameResult.belongsTo(GameBazar, {
  foreignKey: "bazar_id",
  targetKey: "id",
  as: "bazar",
});
GameBazar.hasMany(GameResult, {
  foreignKey: "bazar_id",
  sourceKey: "id",
  as: "results",
});

module.exports = {
  sequelize,
  UserPersonal,
  UserAccount,
  GameResult,
  GameBazar,
  LuckyNumber,
  LuckyNumberRequest,
  Notice,
  GameUserBazar,
  GameBazarDay,
  GameTicket,
  UserPassbook,
  GameUserCommission,
  BazarGuessing,
};
