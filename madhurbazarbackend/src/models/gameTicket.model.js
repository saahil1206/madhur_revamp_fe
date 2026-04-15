const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = sequelize.define("GameTicket", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  ticket_id: { type: DataTypes.INTEGER },
  customer_id: { type: DataTypes.INTEGER },
  game_id: { type: DataTypes.INTEGER },
  game_type: { type: DataTypes.STRING },
  purchase_amount: { type: DataTypes.DOUBLE },
  ticket_status: { type: DataTypes.TINYINT },
  date: { type: DataTypes.DATEONLY },
}, { tableName: "game_ticket", timestamps: false, freezeTableName: true });
