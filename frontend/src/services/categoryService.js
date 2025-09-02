import axiosInstance from "@/api/axiosInstance";
import { HttpStatusCode } from "axios";

export const getCategories = async (parentId) => {
    try {
        const response = await axiosInstance.get("categories", {
            params: { parentId },
        });

        if (response.status !== HttpStatusCode.Ok) {
            throw new Error(`Error fetching categories: ${response.statusText}`);
        }
        return response.data?.data;
    } catch (error) {
        throw error;
    }
};
