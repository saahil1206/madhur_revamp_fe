const { Sequelize } = require("sequelize");
const { db } = require("./env");

const sequelize = new Sequelize(db.database, db.username, db.password, {
  host: db.host,
  port: db.port,
  dialect: "mysql",
  logging: false,
  timezone: "+05:30",
});

module.exports = sequelize;
