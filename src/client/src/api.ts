import axios from "axios";

const { VUE_APP_API_URL: API_URL } = process.env;


export default axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Access-Control-Allow-Origin": "http://localhost:5000",
    "Access-Control-Allow-Credentials": "true",
  },
});
