import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

export default API;

console.log("Base URL:", import.meta.env.VITE_API_URL);
