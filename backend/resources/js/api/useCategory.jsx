import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import axiosInstance from "./axiosInstance";

export const useGetCatergories = (parentId) => {
    return useQuery({
        queryKey: ["getCategories", parentId],
        queryFn: async () => {
            const response = await axiosInstance.get("category/list", {
                params: { parent_id: parentId },
            });
            return response.data ?? [];
        },
    });
};

export const useCreateCategory = () => {
    return useMutation({
        mutationFn: async (category) => {
            const response = await axiosInstance.post("category/create", category);
            return response.data;
        },
    });
};

export const useUpdateCategory = () => {
    return useMutation({
        mutationFn: async ({categoryId, category}) => {
            const response = await axiosInstance.put(`category/update/${categoryId}`, category);
            return response.data;
        },
    });
};

export const useDeleteCategory = () => {
    return useMutation({
        mutationFn: async (categoryId) => {
            const response = await axiosInstance.delete(`category/delete/${categoryId}`);
            return response.data;
        },
    });
};
