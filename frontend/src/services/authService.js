import axiosInstance from "@/api/axiosInstance";

export const login = async (email, password) => {
    try {
        const deviceName = `desktop-web-${new Date().getTime()}`;
        localStorage.setItem("deviceName", deviceName);
        const response = await axiosInstance.post("/login", { email, password, device_name: deviceName });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response);
        } else {
            throw new Error("Network error or server not responding");
        }
    }
};
