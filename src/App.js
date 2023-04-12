import React, { useState, useEffect } from "react";
import axios from "./axios";
import { toast, Toaster } from "react-hot-toast";
import jwt_decode from "jwt-decode";
import "./App.css";

function App() {
  const [currentComp, setCurrentComp] = useState("home");
  const [userToken, setUserToken] = useState("");
  const [decToken, setDecToken] = useState("");

  const showError = (error) => {
    console.log(error);

    if (error?.response?.data?.errors) {
      console.log("errors: ", error?.response?.data?.errors);
      error?.response?.data?.errors?.forEach((error) => {
        toast.error(`${error?.msg} (${error?.param})`);
      });
    } else if (error?.response?.data?.code === "error") {
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
        setDecToken(jwt_decode(localStorage.getItem("token")));
        setCurrentComp("home");
      }
    } catch (error) {
      setUserToken("");
    }
    const storedPosition = sessionStorage.getItem("scrollPosition");
    if (storedPosition) {
      setTimeout(() => {
        console.log("scrolling to storedPosition: ", storedPosition);
        window.scrollTo(0, storedPosition);
      }, 500);
    }

    const handleBeforeUnload = () => {
      console.log("storing scroll position: ", window.scrollY);
      sessionStorage.setItem("scrollPosition", window.scrollY);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
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
            Urdu Q/A Portal <br />(
            {decToken.role === "admin"
              ? "admin"
              : decToken.role === "participator"
              ? "participator"
              : "public"}
            )
          </span>
        </div>
        {userToken && (
          <div
            className={`flex items-center flex-shrink-0 text-white mr-6 cursor-pointer ${
              currentComp === "myQ" ? "border-2 p-2" : ""
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
            currentComp === "home" ? "border-2 p-2" : ""
          }`}
          onClick={() => {
            setCurrentComp("home");
          }}
        >
          <span className="font-semibold text-xl tracking-tight">Home</span>
        </div>
        <div
          className={`flex items-center flex-shrink-0 text-white mr-6 cursor-pointer ${
            currentComp === "ask" ? "border-2 p-2" : ""
          }`}
          onClick={() => {
            setCurrentComp("ask");
          }}
        >
          <span className="font-semibold text-xl tracking-tight">Ask</span>
        </div>
        <div
          className={`flex items-center flex-shrink-0 text-white mr-6 cursor-pointer ${
            currentComp === "search" ? "border-2 p-2" : ""
          }`}
          onClick={() => {
            setCurrentComp("search");
          }}
        >
          <span className="font-semibold text-xl tracking-tight">Search</span>
        </div>
        {decToken.role === "admin" && (
          <div
            className={`flex items-center flex-shrink-0 text-white mr-6 cursor-pointer ${
              currentComp === "engPerc" ? "border-2 p-2" : ""
            }`}
            onClick={() => {
              setCurrentComp("engPerc");
            }}
          >
            <span className="font-semibold text-xl tracking-tight">Admin</span>
          </div>
        )}
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
              }}
            >
              Login
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                setCurrentComp("register");
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
      <div className="flex justify-center items-center mt-28">
        <form onSubmit={handleSubmit} className="w-1/2">
          <h2 className="text-2xl font-medium mb-6">Login</h2>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-400 font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full border rounded py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-400 font-medium mb-2"
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
      } catch (error) {
        showError(error);
      }
    };

    return (
      <div className="flex justify-center items-center mt-28">
        <form onSubmit={handleSubmit} className="w-1/2">
          <h2 className="text-2xl font-medium mb-6">Register</h2>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-400 font-medium mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full border rounded py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-400 font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full border rounded py-2 px-3 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-400 font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Register
          </button>
        </form>
      </div>
    );
  };
  const AnswerUser = ({ id }) => {
    const [user, setUser] = useState([]);
    useEffect(() => {
      axios(`/users/${id}`)
        .then((res) => {
          setUser(res.data.data.user);
        })
        .catch((error) => {
          showError(error);
        });
    }, []);
    return (
      <div>
        <strong>{user.name} : </strong>
      </div>
    );
  };
  const Answer = ({ id, correct, status, setStatus }) => {
    const [answers, setAnswers] = useState([]);
    // const [qStatus, SetQStatus] = useState(status);

    useEffect(() => {
      axios(`/questions/${id}/answers`)
        .then((res) => {
          // console.log(res);
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
          setAnswers((ans) => {
            return ans.map((a) => {
              if (a.id === aID) {
                return { ...a, isCorrect: true };
              } else {
                return { ...a, isCorrect: false };
              }
            });
          });
          setStatus("closed");
        })
        .catch((error) => {
          showError(error);
        });
    };
    const handleDeleteAnswer = async (aID) => {
      axios
        .delete(`/answers/${aID}`)
        .then((res) => {
          toast.success("Answer deleted");
          setAnswers((ans) => {
            return ans.filter((a) => a.id !== aID);
          });
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
              onClick={() => {
                console.log(decToken);
                console.log(answer);
              }}
            >
              <div>
                <div>
                  <AnswerUser id={answer.userId} />
                </div>
                <div className="text-gray-700 break-words max-w-3xl">
                  {answer.text}
                </div>
              </div>

              <div className="text-right">
                {status === "open" &&
                  (decToken.role === "admin" ||
                    decToken.id === answer.userId) && (
                    <button
                      className="w-40 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-4"
                      onClick={() => handleDeleteAnswer(answer.id)}
                    >
                      delete answer
                    </button>
                  )}
                {decToken.role === "admin" && status === "open" ? (
                  <button
                    className="w-40 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-4"
                    onClick={() => handleMarkCorrect(id, answer.id)}
                  >
                    mark as correct
                  </button>
                ) : (
                  status === "open" &&
                  correct && (
                    <button
                      className="w-40 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-4"
                      onClick={() => handleMarkCorrect(id, answer.id)}
                    >
                      mark as correct
                    </button>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  const Question = ({ data, correct, del }) => {
    const [user, setUser] = useState([]);
    const [answerText, setAnswerText] = useState("");
    const [status, setStatus] = useState(data.status);

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
      if (data.userId === decToken.id) {
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
      // setAnswerText("");
    };
    const handleQuestionDelete = async (e) => {
      e.preventDefault();
      try {
        const res = await axios.delete(`/questions/${data.id}`);
        toast.success("Question deleted");
        window.location.reload();
      } catch (error) {
        showError(error);
      }
    };

    return (
      <div
        key={data.id}
        className={`${
          status === "open" ? "bg-white" : "bg-gray-400"
        } shadow p-4 mb-4`}
      >
        <div className="text-gray-600 flex justify-between">
          <p>
            Question by : <strong>{user.name}</strong>
          </p>
          {decToken.role === "admin" ? (
            <button
              onClick={handleQuestionDelete}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              delete question
            </button>
          ) : (
            del && (
              <button
                onClick={handleQuestionDelete}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                delete question
              </button>
            )
          )}
        </div>
        <h3 className="text-lg text-gray-700">Status : {status}</h3>
        <h2 className="text-lg font-bold break-words">title : {data.title}</h2>
        <p className="text-gray-700 break-words">description : {data.text}</p>

        <Answer
          id={data.id}
          correct={correct}
          status={status}
          setStatus={setStatus}
        />
        {status === "open" ? (
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
        ) : (
          ""
        )}
      </div>
    );
  };
  const QuestionsList = () => {
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
      axios("/questions").then((res) => {
        if (res.data.code === "error") {
          toast.error(res.data.data.message);
        } else {
          setQuestions(res.data.data.questions);
        }
      });
    }, []);

    return (
      <div className="p-4 w-3/5 mx-auto">
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
        if (res.data.code === "error") {
          toast.error(res.data.data.message);
          return;
        } else {
          const userId = jwt_decode(userToken).id;
          const myQuestions = res.data.data.questions.filter((question) => {
            return question.userId === userId;
          });
          setQuestions(myQuestions);
        }
      });
    }, []);

    return (
      <div className="p-4 w-3/5 mx-auto">
        <h1 className="text-2xl font-bold mb-4">Questions List</h1>
        {questions.map((question) => (
          <Question
            key={question.id}
            data={question}
            correct={true}
            del={true}
          />
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
      // <div className="flex flex-col items-center justify-center">
      <div className="mt-8">
        <h2 className="text-2xl font-medium mb-6 text-center">
          Search Questions
        </h2>
        <div className="mx-auto w-3/5 p-4 flex items-center justify-center">
          <input
            type="text"
            placeholder="Search questions"
            className="focus:outline-none border border-gray-400 rounded-l-md py-2 px-4 w-full"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-md"
            onClick={handleSearch}
          >
            Search
          </button>
          <div />
        </div>
        <div className="mx-auto flex flex-col w-3/5 p-4">
          {searchResults.map((result) => (
            <div
              key={result.id}
              className="bg-white rounded-xl shadow p-4  my-4"
            >
              <h3 className="font-bold max-w-full break-words">
                title : {result.title}
              </h3>
              <p className="max-w-full break-words">
                description : {result.text}
              </p>
            </div>
          ))}
        </div>
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
        const response = await axios.post("/questions", {
          title,
          text,
        });
        toast.success("Question added");
        setCurrentComp("home");
        window.location.reload();
      } catch (error) {
        showError(error);
      }
    };
    return (
      <form className="p-4 w-3/5 mx-auto" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-200 font-bold mb-2">
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
          <label htmlFor="text" className="block text-gray-200 font-bold mb-2">
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
  const SetPercentage = () => {
    const [minimumPercentage, setMinimumPercentage] = useState("");

    const handleInputChange = (event) => {
      setMinimumPercentage(event.target.value);
    };

    const handleFormSubmit = async (event) => {
      event.preventDefault();
      try {
        await axios.put("/language-setting", { minimumPercentage });
        toast.success("Minimum percentage updated successfully!");
      } catch (error) {
        showError(error);
      }
    };

    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Set Minimum Percentage
        </h2>
        <div className="mx-auto w-3/5 p-4 flex items-center justify-center">
          <input
            className="focus:outline-none border border-gray-400 rounded-l-md py-2 px-4 w-full"
            id="minimumPercentage"
            type="number"
            min="0"
            max="100"
            value={minimumPercentage}
            onChange={handleInputChange}
            required
            placeholder="Enter Percentage"
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-md"
            type="submit"
            onClick={handleFormSubmit}
          >
            Save
          </button>
        </div>
      </div>
    );
  };
  const UserAdmin = () => {
    const [users, setUsers] = useState([]);
    useEffect(() => {
      axios("/users")
        .then((response) => {
          setUsers(response.data.data.users);
          console.log(response.data.data.users);
        })
        .catch((error) => {
          showError(error);
        });
    }, []);
    const handleDelete = (id) => {
      axios
        .delete(`/users/${id}`)
        .then((res) => {
          toast.success(res.data.data.message);
          setUsers((usrs) => {
            console.log(usrs);
            let filteredU = usrs.filter((u) => u.id != id);
            console.log(filteredU);
            return filteredU;
          });
        })
        .catch((error) => {
          showError(error);
        });
    };
    return (
      <div className="mx-auto w-3/5 p-4 flex justify-center flex-col">
        <h1 className="text-lg font-bold text-white">All Users</h1>
        <br />
        {users.map((user) => {
          if(user.role === "admin") return
          return (
            <div key={user.id}>
              <div className="flex rounded-lg justify-between text-lg p-4 text-gray-600 bg-white ">
                <div>
                  <h2>{user.name}</h2>
                  <h2>{user.email}</h2>
                </div>
                <div>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="w-24 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-4"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <br />
            </div>
          );
        })}
      </div>
    );
  };

  if (currentComp === "home") {
    return (
      <>
        <Toaster position="bottom-right" reverseOrder={false} />
        <Navbar />
        <QuestionsList />
      </>
    );
  }
  if (currentComp === "login") {
    return (
      <>
        <Toaster position="bottom-right" reverseOrder={false} />
        <Navbar />
        <Login />
      </>
    );
  }
  if (currentComp === "register") {
    return (
      <>
        <Toaster position="bottom-right" reverseOrder={false} />
        <Navbar />
        <Register />
      </>
    );
  }
  if (currentComp === "search") {
    return (
      <>
        <Toaster position="bottom-right" reverseOrder={false} />
        <Navbar />
        <Search />
      </>
    );
  }
  if (currentComp === "ask") {
    return (
      <>
        <Toaster position="bottom-right" reverseOrder={false} />
        <Navbar />
        <AddQuestion />
      </>
    );
  }
  if (currentComp === "myQ") {
    return (
      <>
        <Toaster position="bottom-right" reverseOrder={false} />
        <Navbar />
        <MyQuestionsList />
      </>
    );
  }
  if (currentComp === "engPerc") {
    return (
      <>
        <Toaster position="bottom-right" reverseOrder={false} />
        <Navbar />
        <SetPercentage />
        <UserAdmin />
      </>
    );
  }
}

export default App;
