import axios from "axios";
export default axios.create({
    baseURL: "http://localhost:8080/edit",
    withCredentials : true,
});