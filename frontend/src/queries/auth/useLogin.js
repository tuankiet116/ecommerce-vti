import { login } from "@/services/authService";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () => {
    return useMutation({
        mutationFn: async ({ email, password }) => {
            const response = await login(email, password);
            return response.data;
        },
    });
};
