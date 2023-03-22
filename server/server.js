const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { sequelize } = require("./db");
const questionsRouter = require("./router");
const { LanguageSetting } = require("./models");

process.on("uncaughtException", function (err) {
  console.log("Caught exception: ", err);
});

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.sendResponse = (status, data, code) => {
    // status, // 200, 201, 400, 404, 500
    const response = {
      code, // success, error
      data,
    };
    res.status(status).json(response);
  };
  next();
});

app.use("/api", questionsRouter);

app.use(express.static("build"));

app.all("*", (req, res) => {
  res.status(404).json({
    code: "error",
    data: {
      message: "Invalid route",
    },
  });
});

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); //{ alter: true }
    let languageSetting = await LanguageSetting.findOne();
    if (!languageSetting) {
      languageSetting = await LanguageSetting.create({ minimumPercentage: 20 });
    }
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
