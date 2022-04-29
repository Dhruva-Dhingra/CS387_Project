import axios from "axios";
export default axios.create({
    baseURL: "http://localhost:8080/get_about",
    withCredentials : true,
});
