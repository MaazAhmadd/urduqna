import React, { useState, useEffect } from "react";
import axios from "./axios";
import { toast, Toaster } from "react-hot-toast";
import jwt_decode from "jwt-decode";
import "./App.css";

function App() {
  const [currentComp, setCurrentComp] = useState("home");
  const [userToken, setUserToken] = useState("");
  const [decToken, setDecToken] = useState(() => {
    try {
      return jwt_decode(userToken);
    } catch (error) {
      return "";
    }
  });

  const showError = (error) => {
    console.log(error);

    if (error?.response?.data?.errors) {
      console.log("errors: ", error?.response?.data?.errors);
      error?.response?.data?.errors?.forEach((error) => {
        toast.error(`${error?.msg} (${error?.param})`);
      });
    } else if (error?.response?.data?.code == "error") {
      toast.error(error?.response?.data?.data?.message);
    }
  };

  useEffect(() => {
    try {
      if (
        localStorage.getItem("token") &&
        localStorage.getItem("token") !== "undefined"
      ) {
        setUserToken(localStorage.getItem("token"));
        setCurrentComp("home");
      }
    } catch (error) {
      setUserToken("");
      // setCurrentComp("home");
    }
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
        {userToken && (
          <div
            className={`flex items-center flex-shrink-0 text-white mr-6 cursor-pointer ${
              currentComp == "myQ" ? "border-2 p-2" : ""
            }`}
            onClick={() => {
              setCurrentComp("myQ");
            }}
          >
            <span className="font-semibold text-xl tracking-tight">MyQ</span>
          </div>
        )}
        <div
          className={`flex items-center flex-shrink-0 text-white mr-6 cursor-pointer ${
            currentComp == "home" ? "border-2 p-2" : ""
          }`}
          onClick={() => {
            setCurrentComp("home");
          }}
        >
          <span className="font-semibold text-xl tracking-tight">Home</span>
        </div>
        <div
          className={`flex items-center flex-shrink-0 text-white mr-6 cursor-pointer ${
            currentComp == "ask" ? "border-2 p-2" : ""
          }`}
          onClick={() => {
            setCurrentComp("ask");
          }}
        >
          <span className="font-semibold text-xl tracking-tight">Ask</span>
        </div>
        <div
          className={`flex items-center flex-shrink-0 text-white mr-6 cursor-pointer ${
            currentComp == "search" ? "border-2 p-2" : ""
          }`}
          onClick={() => {
            setCurrentComp("search");
          }}
        >
          <span className="font-semibold text-xl tracking-tight">Search</span>
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

        localStorage.setItem("token", response.data.data.token);
        toast.success("Login Successful");
        setCurrentComp("home");
        window.location.reload();
        // Redirect user to dashboard or home page
      } catch (error) {
        showError(error);
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
        const response = await axios.post("/register", {
          name,
          email,
          password,
        });

        localStorage.setItem("token", response.data.data.token);
        toast.success("Registration Successful");
        setCurrentComp("home");
        window.location.reload();

        // redirect to dashboard or home page
      } catch (error) {
        showError(error);
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
      try {
        const res = axios(`/users/${id}`);
        setUser(res.data.data.user);
      } catch (error) {
        showError(error);
      }
    }, []);
    return (
      <span>
        <strong>{user.name}</strong>
      </span>
    );
  };
  const Answer = ({ id, correct }) => {
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
      axios(`/questions/${id}/answers`)
        .then((res) => {
          console.log(res);
          setAnswers(res.data.data.answers);
        })
        .catch((error) => {
          showError(error);
        });
    }, []);

    const handleMarkCorrect = async (qID, aID) => {
      axios(`/answers/${qID}/${aID}/correct`)
        .then((res) => {
          toast.success("Answer marked as correct");
          window.location.reload();
        })
        .catch((error) => {
          showError(error);
        });
    };

    return (
      <div className="mt-4">
        {answers.map((answer) => {
          return (
            <div
              key={answer.id}
              className={`flex justify-between items-center 
               ${
                 answer.isCorrect ? "bg-green-500" : "bg-gray-200"
               } p-2 rounded-lg mb-2`}
            >
              <div>
                <AnswerUser id={answer.userId} /> :
                <span className="text-gray-700">{answer.text}</span>
              </div>
              {correct && (
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-4"
                  onClick={() => handleMarkCorrect(id, answer.id)}
                >
                  mark as correct
                </button>
              )}
            </div>
          );
        })}
      </div>
    );
  };
  const Question = ({ data, correct }) => {
    const [user, setUser] = useState([]);
    const [answerText, setAnswerText] = useState("");

    useEffect(() => {
      axios(`/users/${data.userId}`)
        .then((res) => {
          setUser(res.data.data.user);
        })
        .catch((error) => {
          showError(error);
        });
    }, []);
    const handleAnswerSubmit = async (e) => {
      e.preventDefault();
      if (data.userId == decToken.id) {
        toast.error("You can't answer your own question");
        setAnswerText("");
        return;
      }
      try {
        const res = await axios.post(`/questions/${data.id}/answers`, {
          text: answerText,
          userId: decToken.id,
        });
        toast.success("Answer added");
        window.location.reload();
      } catch (error) {
        showError(error);
      }
      setAnswerText("");
    };
    return (
      <div key={data.id} className="bg-white shadow p-4 mb-4">
        <p className="text-gray-600">
          Question by : <strong>{user.name}</strong>
        </p>
        <h3 className="text-lg text-gray-700">Status : {data.status}</h3>
        <h2 className="text-lg font-bold">{data.title}</h2>
        <p className="text-gray-700">{data.text}</p>

        <Answer id={data.id} correct={correct} />
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
      axios("/questions").then((res) => {
        if (res.data.code == "error") {
          toast.error(res.data.data.message);
        } else {
          setQuestions(res.data.data.questions);
        }
      });
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
  const MyQuestionsList = () => {
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
      axios("/questions").then((res) => {
        if (res.data.code == "error") {
          toast.error(res.data.data.message);
          return;
        } else {
          const userId = jwt_decode(userToken).id;
          const myQuestions = res.data.data.questions.filter((question) => {
            return question.userId == userId;
          });
          setQuestions(myQuestions);
        }
      });
    }, []);

    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Questions List</h1>
        {questions.map((question) => (
          <Question key={question.id} data={question} correct={true} />
        ))}
      </div>
    );
  };
  const Search = () => {
    const [searchText, setSearchText] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async () => {
      try {
        const response = await axios.get(`/questions/search/${searchText}`);

        setSearchResults(response.data.data.questions);
      } catch (error) {
        showError(error);
      }
    };

    return (
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center justify-center my-4">
          <input
            type="text"
            placeholder="Search questions"
            className="border border-gray-400 rounded-l-md py-2 px-4 w-full"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-md"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
        {searchResults.map((result) => (
          <div key={result.id} className="bg-white shadow p-4  my-4">
            <h3 className="font-bold">{result.title}</h3>
            <p>{result.text}</p>
          </div>
        ))}
      </div>
    );
  };
  const AddQuestion = () => {
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");

    const handleSubmit = async (event) => {
      event.preventDefault();
      // const token = localStorage.getItem("token");
      if (!userToken) {
        toast.error("Log in to add a question");
        return;
      }
      try {
        const userId = jwt_decode(userToken).id;
        const response = await axios.post("/questions", {
          title,
          text,
          userId,
        });
        // if (response.status >= 200 && response.status <= 299) {
        toast.success("Question added");
        setCurrentComp("home");
        window.location.reload();
      } catch (error) {
        showError(error);
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="text" className="block text-gray-700 font-bold mb-2">
            Description
          </label>
          <textarea
            id="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Question
          </button>
        </div>
      </form>
    );
  };
  if (currentComp == "home") {
    return (
      <>
        <Toaster position="bottom-right" reverseOrder={false} />
        <Navbar />;
        <QuestionsList />;
      </>
    );
  }
  if (currentComp == "login") {
    return (
      <>
        <Toaster position="bottom-right" reverseOrder={false} />
        <Navbar />;
        <Login />;
      </>
    );
  }
  if (currentComp == "register") {
    return (
      <>
        <Toaster position="bottom-right" reverseOrder={false} />
        <Navbar />;
        <Register />;
      </>
    );
  }
  if (currentComp == "search") {
    return (
      <>
        <Toaster position="bottom-right" reverseOrder={false} />
        <Navbar />;
        <Search />;
      </>
    );
  }
  if (currentComp == "ask") {
    return (
      <>
        <Toaster position="bottom-right" reverseOrder={false} />
        <Navbar />;
        <AddQuestion />;
      </>
    );
  }
  if (currentComp == "myQ") {
    return (
      <>
        <Toaster position="bottom-right" reverseOrder={false} />
        <Navbar />;
        <MyQuestionsList />;
      </>
    );
  }
}

export default App;
