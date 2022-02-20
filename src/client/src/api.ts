import axios from "axios";

const { VUE_APP_API_URL: API_URL, VUE_APP_IP: IP } = process.env;


export default axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Access-Control-Allow-Origin": `${IP}:5000`,
    "Access-Control-Allow-Credentials": "true",
  },
});
