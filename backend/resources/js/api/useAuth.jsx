import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";

export const useCheckAuth = () => {
    return useQuery({
        queryKey: ["checkAuth"],
        queryFn: async () => {
            try {
                const response = await axiosInstance.get("check-auth");
                if (response.status === 200 && response.data?.loggedin) {
                    return true;
                }
                window.location.href = "/admin/login";
                return false;
            } catch (error) {
                window.location.href = "/admin/login";
                throw error;
            }
        },
    });
};

export const useLogin = () => {
    return useMutation({
        mutationFn: async (credentials) => {
            const response = await axiosInstance.post("login", credentials);
            return response.data ?? null;
        },
    });
};

export const useLogout = () => {
    return useMutation({
        mutationFn: async () => {
            const response = await axiosInstance.post("logout");
            if (response.status === 200) {
                window.location.href = "/admin/login";
            }
            return response.data ?? null;
        },
    });
};
