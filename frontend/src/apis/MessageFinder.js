import axios from "axios";
export default axios.create({
    baseURL: "http://localhost:8080/messenger",
    withCredentials : true,
});