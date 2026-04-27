import axios from "axios";
import { API_CONFIG } from "../config/apiConfig";

const API = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;