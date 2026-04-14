const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = sequelize.define("UserPassbook", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  game_user_id: { type: DataTypes.INTEGER },
  date: { type: DataTypes.DATEONLY },
}, { tableName: "user_passbook", timestamps: false, freezeTableName: true });
