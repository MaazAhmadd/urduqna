const { sequelize, DataTypes } = require("./db");

const User = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("admin", "participator"),
    defaultValue: "participator",
  },
});

const Question = sequelize.define("question", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  englishWordsPercentage: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM("open", "closed"),
    defaultValue: "open",
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

const Answer = sequelize.define("answer", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  englishWordsPercentage: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isCorrect: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isHelpful: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

const LanguageSetting = sequelize.define("LanguageSetting", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  minimumPercentage: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

User.hasMany(Question);
Question.belongsTo(User);
User.hasMany(Answer);
Answer.belongsTo(User);
Question.hasMany(Answer);
Answer.belongsTo(Question);

module.exports = {
  User,
  Question,
  Answer,
  LanguageSetting,
};
