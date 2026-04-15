const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserAccount = sequelize.define(
  "UserAccount",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    game_user_id: { type: DataTypes.INTEGER, allowNull: false },
    game_group_id: { type: DataTypes.INTEGER },
    creditrefrence: { type: DataTypes.DOUBLE },
    exposurelimit: { type: DataTypes.DOUBLE },
    deleted_at: { type: DataTypes.DATE },
  },
  {
    tableName: "game_user_account",
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = UserAccount;
