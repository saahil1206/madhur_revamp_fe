const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = sequelize.define("GameUserBazar", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  game_user_id: { type: DataTypes.INTEGER },
  game_bazar_id: { type: DataTypes.INTEGER },
}, { tableName: "game_user_bazar", timestamps: false, freezeTableName: true });
