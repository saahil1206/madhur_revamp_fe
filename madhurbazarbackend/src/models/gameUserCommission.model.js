const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = sequelize.define("GameUserCommission", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  game_user_id: { type: DataTypes.INTEGER },
  partnership: { type: DataTypes.DOUBLE },
}, { tableName: "game_user_commission", timestamps: false, freezeTableName: true });
