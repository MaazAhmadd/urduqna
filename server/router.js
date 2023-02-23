// Import necessary modules
const express = require("express");
const router = express.Router();
const { User, Question, Answer } = require("./models");

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

// GET all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
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

// POST a new user
router.post("/users", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.create({ name, email, password });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT (update) an existing user
router.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  try {
    const user = await User.findByPk(id);
    user.name = name;
    user.email = email;
    user.password = password;
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE an existing user
router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    await user.destroy();
    res.status(204).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
