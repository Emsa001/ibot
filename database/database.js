const { Sequelize } = require("sequelize");

module.exports = new Sequelize("db_user", "db_name", "db_password", {
  host: "host",
  dialect: "mysql",
});
