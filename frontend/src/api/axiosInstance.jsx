import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve();
    });
    failedQueue = [];
};

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 10000,
    withCredentials: true, // Needed for cookies
    headers: {
        "Content-Type": "application/json",
    },
});

// Optional: Add interceptors for auth token
axiosInstance.interceptors.request.use((config) => {
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Wait until refresh completes
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => axiosInstance(originalRequest))
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                let deviceId = localStorage.getItem("device_id");
                if (!deviceId) {
                    deviceId = crypto.randomUUID();
                    localStorage.setItem("device_id", deviceId);
                }
                await axiosInstance
                    .post("/refresh-token", {
                        device_name: `web_${deviceId}`,
                    })
                    .catch((err) => {
                        if (err.response?.status > 400) {
                            window.location.href = "/login";
                            return Promise.reject(err);
                        }
                        console.error("Error refreshing token:", err);
                        return Promise.reject(err);
                    });
                processQueue(null);
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    },
);

export default axiosInstance;
