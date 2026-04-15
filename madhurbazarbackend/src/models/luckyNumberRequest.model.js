const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = sequelize.define(
  "LuckyNumberRequest",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    mobile_number: { type: DataTypes.STRING(10), allowNull: false },
    lucky_digit: { type: DataTypes.TINYINT.UNSIGNED, allowNull: false },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  { tableName: "lucky_number_request", timestamps: false, freezeTableName: true }
);
