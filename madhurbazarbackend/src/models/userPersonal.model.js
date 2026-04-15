const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserPersonal = sequelize.define(
  "UserPersonal",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    fullname: { type: DataTypes.STRING },
    phonenumber: { type: DataTypes.STRING },
    city: { type: DataTypes.STRING },
    img: { type: DataTypes.TEXT("long") },
    blocked_status: { type: DataTypes.TINYINT },
    transaction_status: { type: DataTypes.TINYINT },
    deleted_at: { type: DataTypes.DATE },
  },
  {
    tableName: "game_user_personal",
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = UserPersonal;
