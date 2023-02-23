import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "./axios";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between flex-wrap bg-gray-800 p-6">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <span className="font-semibold text-xl tracking-tight">
          Urdu Q/A Portal
        </span>
      </div>
      <div className="flex">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4">
          Login
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Register
        </button>
      </div>
    </nav>
  );
};
const Answer = ({ id }) => {
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    fetch(`/questions/${id}/answers`)
      .then((res) => res.json())
      .then((data) => setAnswers(data));
  }, []);

  return (
    <div className="mt-4">
      {answers.map((answer) => {
        <div key={answer.id} className="bg-gray-200 p-2 rounded-lg mb-2">
          <p className="text-gray-700">{answer.text}</p>
        </div>;
      })}
    </div>
  );
};

const Question = ({ data }) => {
  const [user, setUser] = useState([]);
  useEffect(() => {
    fetch(`/api/users/${data.userId}`)
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, []);

  return (
    <div key={data.id} className="bg-white shadow p-4 mb-4">
      <p className="text-gray-600">{user.name}</p>
      <h2 className="text-lg font-bold">{data.title}</h2>
      <p className="text-gray-700">{data.text}</p>

      <Answer id={data.id} />
    </div>
  );
};

const QuestionsList = () => {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      title: "title of first question",
      text: "description of first question",
      englishWordsPercentage: 0,
      status: "open",
      createdAt: "2023-02-23T12:02:09.464Z",
      updatedAt: "2023-02-23T12:02:09.464Z",
      userId: 1,
      answers: [
        {
          id: 1,
          text: "description of first question by user 1",
          englishWordsPercentage: 0,
          isCorrect: false,
          isHelpful: false,
          createdAt: "2023-02-23T12:04:54.830Z",
          updatedAt: "2023-02-23T12:04:54.830Z",
          userId: 1,
          questionId: 1,
        },
      ],
    },
    {
      id: 2,
      title: "title of 2nd question",
      text: "description of 2nd question",
      englishWordsPercentage: 0,
      status: "open",
      createdAt: "2023-02-23T12:02:30.070Z",
      updatedAt: "2023-02-23T12:02:30.070Z",
      userId: 1,
      answers: [
        {
          id: 2,
          text: "answer of 2nd question by user 2",
          englishWordsPercentage: 0,
          isCorrect: false,
          isHelpful: false,
          createdAt: "2023-02-23T12:05:18.397Z",
          updatedAt: "2023-02-23T12:05:18.397Z",
          userId: 2,
          questionId: 2,
        },
        {
          id: 3,
          text: "another answer of 2nd question by user 2",
          englishWordsPercentage: 0,
          isCorrect: false,
          isHelpful: false,
          createdAt: "2023-02-23T12:08:08.952Z",
          updatedAt: "2023-02-23T12:08:08.952Z",
          userId: 2,
          questionId: 2,
        },
      ],
    },
  ]);

  // useEffect(() => {
  //   fetch("/api/questions")
  //     .then((res) => res.json())
  //     .then((data) => setQuestions(data));
  // }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Questions List</h1>
      {questions.map((question) => (
        <Question key={question.id} data={question} />
      ))}
    </div>
  );
};
function App() {
  return (
    <>
      <Navbar />;
      <QuestionsList />;
    </>
  );
}

export default App;
