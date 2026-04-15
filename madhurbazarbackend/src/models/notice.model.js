const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = sequelize.define("Notice", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
}, { tableName: "notice", timestamps: false, freezeTableName: true });
