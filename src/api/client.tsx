import axios from "axios";

const API = axios.create({
  baseURL: "https://your-api-url.com/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;