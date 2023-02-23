// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { sequelize } = require("./db");
// const Question = require("./models/question");
// const User = require("./models/user");
// const Answer = require("./models/answer");
const questionsRouter = require("./router");

// Define the express app
const app = express();

// Set up middleware
app.use(cors());
app.use(bodyParser.json());

// Define routes
app.use("/api", questionsRouter);

// Set up database connection and synchronize the models
(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
