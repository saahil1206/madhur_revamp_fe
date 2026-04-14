const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const GameResult = sequelize.define(
  "GameResult",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    bazar_id: { type: DataTypes.INTEGER, allowNull: false },
    result_type: { type: DataTypes.STRING, allowNull: false },
    result_date: { type: DataTypes.DATEONLY, allowNull: false },
    result_pana: { type: DataTypes.STRING },
    result_AAkda: { type: DataTypes.STRING },
    after_time: { type: DataTypes.STRING },
    showtime: { type: DataTypes.STRING },
    createdby: { type: DataTypes.STRING },
  },
  {
    tableName: "game_result",
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = GameResult;
