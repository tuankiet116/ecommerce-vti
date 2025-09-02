import axios from "axios";
import { redirect } from "react-router";

const axiosInstance = axios.create({
    baseURL: "/api/admin",
});

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            redirect("/admin/login");
        }
        return Promise.reject(error);
    },
);

export default axiosInstance;
