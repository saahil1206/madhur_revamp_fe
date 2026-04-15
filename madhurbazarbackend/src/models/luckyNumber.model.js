const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = sequelize.define("LuckyNumber", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  aakda: { type: DataTypes.STRING(255), allowNull: true },
  pana: { type: DataTypes.STRING(255), allowNull: true },
  jodi: { type: DataTypes.STRING(255), allowNull: true },
  motor: { type: DataTypes.STRING(255), allowNull: true },
}, { tableName: "lucky_number", timestamps: false, freezeTableName: true });
