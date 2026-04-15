const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = sequelize.define("GameBazarDay", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  game_bazar_id: { type: DataTypes.INTEGER },
}, { tableName: "game_bazar_day", timestamps: false, freezeTableName: true });
