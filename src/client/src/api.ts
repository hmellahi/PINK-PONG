import axios from "axios";

const { VUE_APP_API_URL: API_URL } = process.env;
console.log(process.env)
export default axios.create({
  baseURL: API_URL,
});
