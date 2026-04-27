const { DataTypes } = require("sequelize");

async function ensureSessionColumn(sequelize) {
  const queryInterface = sequelize.getQueryInterface();
  const tableName = "game_user_personal";
  const columnName = "active_session_id";
  const tableDefinition = await queryInterface.describeTable(tableName);

  if (!tableDefinition[columnName]) {
    await queryInterface.addColumn(tableName, columnName, {
      type: DataTypes.STRING,
      allowNull: true,
    });
  }
}

module.exports = ensureSessionColumn;
