// Import necessary modules
const express = require("express");
const router = express.Router();
const { User, Question, Answer } = require("./models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { body, validationResult } = require("express-validator");

let jwt_private = process.env.JWT_PRIVATE_KEY || "jwt_private_key";

// middlewares
const auth = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token)
    return res.sendResponse(401, { message: "kindly login first!." }, "error");
  // res.status(401).send("kindly login first!.");
  try {
    const decoded = jwt.verify(token, jwt_private);
    req.user = decoded;
    next();
  } catch (ex) {
    res.sendResponse(400, { message: "kindly login again!." }, "error");
    // res.status(400).send("Invalid token.");
  }
};
const admin = function (req, res, next) {
  // "admin ", req.user;
  if (req.user.role !== "admin") {
    return res.sendResponse(403, { message: "you are not admin!" }, "error");
    // res.status(403).send("access denied");
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
    res.sendResponse(200, { questions }, "success");
  } catch (err) {
    console.error(err);
    res.sendResponse(404, { message: "couldn't find questions" }, "error");
  }
});
// search questions
router.get("/questions/search/:searchText", async (req, res) => {
  const searchText = req.params.searchText;
  try {
    const questions = await Question.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${searchText}%` } },
          { text: { [Op.like]: `%${searchText}%` } },
        ],
      },
      attributes: ["id", "title", "text", "createdAt"],
    });
    res.sendResponse(200, { questions }, "success");
  } catch (error) {
    console.error(error);
    res.sendResponse(404, { message: "couldn't find questions" }, "error");
  }
});
// GET a specific question and its answers
router.get("/questions/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const question = await Question.findByPk(id, { include: Answer });
    if (!question)
      return res.sendResponse(404, { message: "question not found" }, "error");
    res.sendResponse(200, { question }, "success");
  } catch (err) {
    console.error(err);
    res.sendResponse(404, { message: "question not found" }, "error");
  }
});

// POST a new question
router.post(
  "/questions",
  body("title").notEmpty().isString(),
  body("text").notEmpty().isString(),
  body("userId").notEmpty().isNumeric(),
  auth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, text, userId } = req.body;
    try {
      const question = await Question.create({ title, text, userId });
      res.sendResponse(200, { question }, "success");
    } catch (err) {
      console.error(err);
      res.sendResponse(500, { message: "couldn't add question" }, "error");
    }
  }
);

// PUT (update) an existing question
router.put(
  "/questions/:id",
  body("title").notEmpty().isString(),
  body("text").notEmpty().isString(),
  auth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;
    const { title, text } = req.body;
    try {
      const question = await Question.findByPk(id);
      question.title = title;
      question.text = text;
      await question.save();
      res.sendResponse(200, { question }, "success");
    } catch (err) {
      console.error(err);
      res.sendResponse(500, { message: "couldn't update question" }, "error");
    }
  }
);

// DELETE an existing question
router.delete("/questions/:id", auth, async (req, res) => {
  const { id } = req.params;
  try {
    const question = await Question.findByPk(id);
    // Check if the logged in user is the owner of the question

    if (!question)
      return res.sendResponse(404, { message: "question not found" }, "error");

    if (req.user.role == "admin") {
    } else if (question.userId !== req.user.id) {
      return res.sendResponse(403, { message: "Unauthorized" }, "error");
    }
    await question.destroy();
    res.sendResponse(
      200,
      { message: "question deleted successfully" },
      "success"
    );
  } catch (err) {
    console.error(err);
    res.sendResponse(500, { message: "couldn't delete question" }, "error");
  }
});

// GET all answers for a specific question
router.get("/questions/:id/answers", async (req, res) => {
  const { id } = req.params;
  try {
    const answers = await Answer.findAll({ where: { questionId: id } });
    res.sendResponse(200, { answers }, "success");
  } catch (err) {
    console.error(err);
    res.sendResponse(500, { message: "couldn't get answers" }, "error");
  }
});

// POST a new answer for a specific question
router.post(
  "/questions/:id/answers",
  body("text").notEmpty().isString(),
  auth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { text, userId } = req.body;
    const { id } = req.params;
    try {
      const answer = await Answer.create({
        text,
        userId,
        questionId: id,
      });
      res.sendResponse(200, { answer }, "success");
    } catch (err) {
      console.error(err);
      res.sendResponse(500, { message: "couldn't add answer" }, "error");
    }
  }
);

// PUT (update) an existing answer
router.put(
  "/answers/:id",
  body("text").notEmpty().isString(),
  auth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;
    const { text } = req.body;
    try {
      const answer = await Answer.findByPk(id);
      answer.text = text;
      await answer.save();
      res.sendResponse(200, { answer }, "success");
    } catch (error) {
      console.log(error);
      res.sendResponse(500, { message: "couldn't update answer" }, "error");
    }
  }
);

// DELETE an existing answer
router.delete("/answers/:id", auth, async (req, res) => {
  const { id } = req.params;

  try {
    const answer = await Answer.findByPk(id);
    if (req.user.role == "admin") {
    } else if (answer.userId !== req.user.id)
      return res.sendResponse(403, { message: "not your answer!" }, "error");
    await answer.destroy();
    res.sendResponse(
      200,
      { message: "answer deleted successfully" },
      "success"
    );
  } catch (error) {
    console.log(error);
    res.sendResponse(500, { message: "couldn't delete answer" }, "error");
  }
});

// Set an answer to correct
router.get("/answers/:questionId/:answerId/correct", auth, async (req, res) => {
  const { questionId, answerId } = req.params;
  const isAnotherAnswerCorrect = await Answer.findOne({
    where: {
      questionId: questionId,
      isCorrect: true,
      id: { [Op.ne]: answerId },
    },
  });
  if (isAnotherAnswerCorrect) {
    return res.sendResponse(
      400,
      {
        message:
          "Another answer for this question is already marked as correct",
      },
      "error"
    );
  }
  try {
    // Find the question
    const question = await Question.findOne({
      where: { id: questionId },
      include: [Answer],
    });

    if (!question) {
      return res.sendResponse(404, { message: "question not found" }, "error");
    }

    // Check if the logged in user is the owner of the question
    if (req.user.role == "admin") {
    } else if (question.userId !== req.user.id) {
      return res.sendResponse(403, { message: "Unauthorized" }, "error");
    }

    // Find the answer
    const answer = question.answers.find((a) => a.id === +answerId);

    if (!answer) {
      return res.status(404).json({ error: "Answer not found" });
    }

    // Set the answer to correct
    answer.isCorrect = true;
    await answer.save();
    question.status = "closed";
    await question.save();

    res.sendResponse(200, { answer }, "success");
  } catch (err) {
    console.error(err);
    res.sendResponse(500, { message: "couldn't update answer" }, "error");
  }
});

// router.post("/login", async function (req, res) {
//   const { email, password } = req.body;

//   if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//     try {
//       const user = await User.findOne({
//         where: {
//           email: email,
//         },
//       });

//       try {
//         const validPassword = await bcrypt.compare(password, user.password);
//         if (validPassword) {
//           const token = jwt.sign(
//             {
//               name: user.name,
//               email: user.email,
//               role: user.role,
//               id: user.id,
//             },
//             jwt_private
//           );

//           // res.send(
//           //   createResponse("success", "User Logged In", token, user.role)
//           // );
//           res.sendResponse(200, token, "success");
//         } else {
//           // res.send(createResponse("error", "Invalid Username/Password"));
//           res.sendResponse(
//             401,
//             { message: "Invalid Username/Password" },
//             "error"
//           );
//         }
//       } catch (error) {
//         res.sendResponse(
//           401,
//           { message: "Invalid Username/Password" },
//           "error"
//         );
//         // res.send(createResponse("error", "Invalid Username/Password"));
//       }
//     } catch (err) {
//       res.sendResponse(401, { message: "Invalid Username/Password" }, "error");
//       // res.send(createResponse("error", "Invalid Username/Password"));
//     }
//   } else {
//     res.sendResponse(401, { message: "Invalid Username/Password" }, "error");
//     // res.send(createResponse("error", "Enter a valid email"));
//   }
// });
router.post(
  "/login",
  body("email").isEmail().normalizeEmail().notEmpty(),
  body("password").notEmpty(),
  async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ where: { email: email } });

      if (!user) {
        return res.sendResponse(
          401,
          { message: "Invalid Username/Password" },
          "error"
        );
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.sendResponse(
          401,
          { message: "Invalid Username/Password" },
          "error"
        );
      }
      const token = jwt.sign(
        {
          name: user.name,
          email: user.email,
          role: user.role,
          id: user.id,
        },
        jwt_private
      );
      return res.sendResponse(200, { token }, "success");
    } catch (error) {
      return res.sendResponse(
        500,
        { message: "Internal Server Error" },
        "error"
      );
    }
  }
);

// router.post("/register", async function (req, res) {
//   const salt = await bcrypt.genSalt(10);
//   let { name, email, password } = req.body;
//   password = await bcrypt.hash(password, salt);

//   if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//     try {
//       const user = await User.create({ name, email, password });
//       const token = jwt.sign(
//         {
//           name: user.name,
//           email: user.email,
//           role: user.role,
//           id: user.id,
//         },
//         jwt_private
//       );
//       res.send(
//         createResponse("success", "User Registered Succesfully!", token)
//       );
//     } catch (error) {
//       res.send(createResponse("error", "user already exists"));
//     }
//   } else {
//     res.send(createResponse("error", "Enter a valid email"));
//   }
// });
// GET a single user by ID

router.post(
  "/register",
  body("name").notEmpty().trim().escape().isLength({ min: 3 }),
  // .withMessage("Name must be at least 3 characters long")
  body("email").isEmail().normalizeEmail().notEmpty(),
  body("password")
    .isLength({ min: 6 })
    .notEmpty()
    .isStrongPassword()
    .withMessage(
      "Password must be at least 6 characters long and contain at least one lowercase, uppercase, numeric, and special character"
    ),
  async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const salt = await bcrypt.genSalt(10);
    let { name, email, password } = req.body;
    password = await bcrypt.hash(password, salt);

    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      try {
        const user = await User.create({ name, email, password });
        const token = jwt.sign(
          {
            name: user.name,
            email: user.email,
            role: user.role,
            id: user.id,
          },
          jwt_private
        );
        res.sendResponse(201, { token }, "success");
      } catch (error) {
        res.sendResponse(409, { message: "user already exists" }, "error");
      }
    } else {
      res.sendResponse(400, { message: "Enter a valid email" }, "error");
    }
  }
);

router.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      res.sendResponse(404, { message: "User not found" }, "error");
    } else {
      res.sendResponse(200, { user }, "success");
    }
  } catch (err) {
    res.sendResponse(500, { message: "couldn't find User" }, "error");
  }
});

module.exports = router;
