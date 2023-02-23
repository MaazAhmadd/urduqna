const { Sequelize, Model, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.db",
});

// sequelize
//   .authenticate()
//   .sync({ alter: true })
//   .then(() => {
//     console.log("Database connected.");
//   })
//   .catch((err) => {
//     console.error("Unable to connect to the database:", err);
//   });

module.exports = { sequelize, DataTypes };
