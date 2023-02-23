import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3001",
  headers: {
    "x-auth-header": localStorage.getItem("token"),
  },
});

export default instance;
