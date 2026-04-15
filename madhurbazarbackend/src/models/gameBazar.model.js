const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const GameBazar = sequelize.define(
  "GameBazar",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    bazar_name: { type: DataTypes.STRING },
    open_time: { type: DataTypes.STRING },
    close_time: { type: DataTypes.STRING },
    Notice: { type: DataTypes.STRING },
    status: { type: DataTypes.TINYINT },
    visiability: { type: DataTypes.STRING },
    bazar_category: { type: DataTypes.STRING },
    open_block_time: { type: DataTypes.STRING },
    close_block_time: { type: DataTypes.STRING },
  },
  {
    tableName: "game_bazar",
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = GameBazar;
