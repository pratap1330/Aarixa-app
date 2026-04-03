import axios from "axios";

const API = axios.create({
  baseURL: "http://43.224.137.63:9085/",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;