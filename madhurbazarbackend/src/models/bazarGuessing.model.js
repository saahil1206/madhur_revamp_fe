const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const BazarGuessing = sequelize.define(
  "BazarGuessing",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    bazar_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    guessing_digits: { type: DataTypes.STRING(20), allowNull: false, defaultValue: "0000" },
  },
  {
    tableName: "game_bazar_guessing",
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = BazarGuessing;
