import { getCategories } from "@/services/categoryService";
import { useQuery } from "@tanstack/react-query";

export const useGetCategories = (parentId) => {
    return useQuery({
        queryKey: ["categories", parentId],
        queryFn: async () => {
            return await getCategories(parentId);
        },
    });
};
