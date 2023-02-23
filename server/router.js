// Import necessary modules
const express = require("express");
const router = express.Router();
const { User, Question, Answer } = require("./models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

let jwt_private = process.env.JWT_PRIVATE_KEY || "jwt_private_key";

// middlewares
const auth = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided.");
  try {
    const decoded = jwt.verify(token, jwt_private);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
};
const admin = function (req, res, next) {
  "admin ", req.user;
  if (req.user.role !== "admin") {
    return res.status(403).send("access denied");
  }
  next();
};

function createResponse(type, response, token, role) {
  if (role !== "" || role !== null) {
    return JSON.stringify({ code: type, msg: response, role: role, token });
  } else {
    return JSON.stringify({ code: type, msg: response, token: token });
  }
}

// GET all questions
router.get("/questions", async (req, res) => {
  try {
    const questions = await Question.findAll();
    res.status(200).json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// GET a specific question and its answers
router.get("/questions/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const question = await Question.findByPk(id, { include: Answer });
    res.status(200).json(question);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// POST a new question
router.post("/questions", async (req, res) => {
  const { title, text, userId } = req.body;
  try {
    const question = await Question.create({ title, text, userId });
    res.status(201).json(question);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// PUT (update) an existing question
router.put("/questions/:id", async (req, res) => {
  const { id } = req.params;
  const { title, text } = req.body;
  try {
    const question = await Question.findByPk(id);
    question.title = title;
    question.text = text;
    await question.save();
    res.status(200).json(question);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// DELETE an existing question
router.delete("/questions/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const question = await Question.findByPk(id);
    await question.destroy();
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// GET all answers for a specific question
router.get("/questions/:id/answers", async (req, res) => {
  const { id } = req.params;
  try {
    const answers = await Answer.findAll({ where: { questionId: id } });
    res.status(200).json(answers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// POST a new answer for a specific question
router.post("/questions/:id/answers", async (req, res) => {
  const { text, userId } = req.body;
  const { id } = req.params;
  try {
    const answer = await Answer.create({
      text,
      userId,
      questionId: id,
    });
    res.status(201).json(answer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// PUT (update) an existing answer
router.put("/answers/:id", async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  try {
    const answer = await Answer.findByPk(id);
    answer.text = text;
    await answer.save();

    res
      .status(200)
      .json({ success: true, message: "Answer updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error updating answer" });
  }
});

// DELETE an existing answer
router.delete("/answers/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const answer = await Answer.findByPk(id);
    await answer.destroy();
    res
      .status(200)
      .json({ success: true, message: "Answer deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error deleting answer" });
  }
});

router.post("/login", async function (req, res) {
  const { email, password } = req.body;

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    try {
      const user = await User.findOne({
        where: {
          email: email,
        },
      });

      try {
        const validPassword = await bcrypt.compare(password, user.password);
        if (validPassword) {
          const token = jwt.sign(
            {
              name: user.name,
              email: user.email,
              role: user.role,
            },
            jwt_private
          );

          res.send(
            createResponse("success", "User Logged In", token, user.role)
          );
        } else {
          res.send(createResponse("error", "Invalid Username/Password"));
        }
      } catch (error) {
        res.send(createResponse("error", "Invalid Username/Password"));
      }
    } catch (err) {
      res.send(createResponse("error", "Invalid Username/Password"));
    }
  } else {
    res.send(createResponse("error", "Enter a valid email"));
  }
});
router.post("/register", async function (req, res) {
  const salt = await bcrypt.genSalt(10);
  let { name, email, password } = req.body;
  password = await bcrypt.hash(password, salt);

  const token = jwt.sign(
    {
      name: name,
      email: email,
      role: "user",
    },
    jwt_private
  );
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    try {
      const user = await User.create({ name, email, password });
      res.send(
        createResponse("success", "User Registered Succesfully!", token)
      );
    } catch (error) {
      res.send(createResponse("error", "user already exists"));
    }
  } else {
    res.send(createResponse("error", "Enter a valid email"));
  }
});
// GET a single user by ID
router.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json(user);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
