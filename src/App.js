import React, { useState, useEffect } from "react";
import axios from "./axios";
import "./App.css";
// import { toast, ToastContainer } from "react-toastify";
import { toast, Toaster } from "react-hot-toast";
import jwt_decode from "jwt-decode";

function App() {
  const [currentComp, setCurrentComp] = useState("home");
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    try {
      if (localStorage.getItem("token")) {
        setUserToken(localStorage.getItem("token"));
        setCurrentComp("home");
      }
    } catch (error) {}
  }, []);
  const Navbar = () => {
    return (
      <nav className="flex items-center justify-between flex-wrap bg-gray-800 p-6">
        <div
          className="flex items-center flex-shrink-0 text-white mr-6 cursor-pointer"
          onClick={() => {
            setCurrentComp("home");
            window.location = "/";
          }}
        >
          <span className="font-semibold text-xl tracking-tight">
            Urdu Q/A Portal
          </span>
        </div>
        <div
          className="flex items-center flex-shrink-0 text-white mr-6 cursor-pointer"
          onClick={() => {
            setCurrentComp("home");
          }}
        >
          <span className="font-semibold text-xl tracking-tight">Home</span>
        </div>
        {userToken ? (
          <div className="flex">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
              onClick={() => {
                localStorage.removeItem("token");
                setCurrentComp("home");
                window.location.reload();
              }}
            >
              LogOut
            </button>
          </div>
        ) : (
          <div className="flex">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
              onClick={() => {
                setCurrentComp("login");
                // window.location.reload();
              }}
            >
              Login
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                setCurrentComp("register");
                // window.location.reload();
              }}
            >
              Register
            </button>
          </div>
        )}
      </nav>
    );
  };
  const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event) => {
      event.preventDefault();
      try {
        const response = await axios.post("/login", { email, password });
        localStorage.setItem("token", response.data.token);
        toast.success("Login Successful");
        setCurrentComp("home");
        window.location.reload();
        // Redirect user to dashboard or home page
      } catch (error) {
        console.error(error);
      }
    };

    return (
      <div className="flex justify-center items-center h-screen">
        <form onSubmit={handleSubmit} className="w-1/2">
          <h2 className="text-2xl font-medium mb-6">Login</h2>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Login
          </button>
        </form>
      </div>
    );
  };
  const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios
          .post("/register", {
            name,
            email,
            password,
          })
          .catch((error) => {
            toast.error(error.response.data.msg);
          });
        console.log(response.data);
        if (response.data.code == "error") {
          toast.error(response.data.msg);
        } else {
          localStorage.setItem("token", response.data.token);
          toast.success("Registration Successful");
          setCurrentComp("home");
          window.location.reload();
        }

        // redirect to dashboard or home page
      } catch (error) {
        console.log(error.response.data.message);
        // show error message
      }
    };

    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white rounded shadow p-8 max-w-sm w-full">
          <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 font-bold mb-2"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="border rounded-lg px-3 py-2 w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-bold mb-2"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="border rounded-lg px-3 py-2 w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 font-bold mb-2"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className="border rounded-lg px-3 py-2 w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  const AnswerUser = ({ id }) => {
    const [user, setUser] = useState([]);
    useEffect(() => {
      axios(`/users/${id}`).then((data) => setUser(data.data));
    }, []);
    return (
      <span>
        <strong>{user.name}</strong>
      </span>
    );
  };
  const Answer = ({ id }) => {
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
      axios(`/questions/${id}/answers`).then((data) => setAnswers(data.data));
    }, []);

    return (
      <div className="mt-4">
        {answers.map((answer) => (
          <div key={answer.id} className="bg-gray-200 p-2 rounded-lg mb-2">
            <AnswerUser id={answer.userId} /> :
            <span className="text-gray-700">{answer.text}</span>
          </div>
        ))}
      </div>
    );
  };

  const Question = ({ data }) => {
    const [user, setUser] = useState([]);
    const [answerText, setAnswerText] = useState("");

    useEffect(() => {
      axios(`/users/${data.userId}`).then((data) => setUser(data.data));
    }, []);
    const handleAnswerSubmit = async (e) => {
      e.preventDefault();
      const decToken = jwt_decode(userToken);
      try {
        const response = await axios.post(`/questions/${data.id}/answers`, {
          text: answerText,
          userId: decToken.id,
        });
        toast.success("Answer added");
        console.log(response.data);
        window.location.reload();
      } catch (error) {
        toast.error("Error adding answer");
        console.log(error);
      }
      setAnswerText("");
    };
    return (
      <div key={data.id} className="bg-white shadow p-4 mb-4">
        <p className="text-gray-600">
          Question by : <strong>{user.name}</strong>
        </p>
        <h2 className="text-lg font-bold">{data.title}</h2>
        <p className="text-gray-700">{data.text}</p>

        <Answer id={data.id} />
        <form onSubmit={handleAnswerSubmit}>
          <div className="mt-4">
            <label
              htmlFor="answer"
              className="block text-gray-700 font-bold mb-2"
            >
              Your answer:
            </label>
            <textarea
              id="answer"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    );
  };

  const QuestionsList = () => {
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
      axios("/questions").then((data) => setQuestions(data.data));
    }, []);

    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Questions List</h1>
        {questions.map((question) => (
          <Question key={question.id} data={question} />
        ))}
      </div>
    );
  };

  if (currentComp == "home") {
    return (
      <>
        <Toaster position="top-center" reverseOrder={false} />
        <Navbar />;
        <QuestionsList />;
      </>
    );
  }
  if (currentComp == "login") {
    return (
      <>
        <Toaster position="top-center" reverseOrder={false} />
        <Navbar />;
        <Login />;
      </>
    );
  }
  if (currentComp == "register") {
    return (
      <>
        <Toaster position="top-center" reverseOrder={false} />
        <Navbar />;
        <Register />;
      </>
    );
  }
  // return (
  //   <>
  //     <Navbar />;
  //     <QuestionsList />;
  //   </>
  // );
}

export default App;
