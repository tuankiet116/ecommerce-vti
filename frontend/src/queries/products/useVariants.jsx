import { bulkUpdateVariants, getVariants } from "@/services/variantService";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetVariants = (page) => {
    return useQuery({
        queryKey: ["variants", page],
        queryFn: async () => {
            try {
                let result = await getVariants(page);
                return result?.data ?? [];
            } catch (error) {
                console.error("Error fetching variants:", error);
                return [];
            }
        },
    });
};

export const useBulkUpdateVariants = () => {
    return useMutation({
        mutationFn: async (data) => {
            try {
                let result = await bulkUpdateVariants(data);
                return result?.data ?? null;
            } catch (error) {
                throw error.response;
            }
        },
    });
};
