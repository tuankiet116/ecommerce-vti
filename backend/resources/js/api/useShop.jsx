import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axiosInstance";

export const useGetShopApprovals = (status, filter = "", page = 1) => {
    return useQuery({
        queryKey: ["shop-approvals", status, filter, page],
        queryFn: async () => {
            const response = await axiosInstance.get("/shop/list", {
                params: {
                    status: status,
                    search: filter,
                    page: page,
                },
            });
            return response.data?.data ?? [];
        },
    });
};

export const useUpdateShopStatus = () => {
    return useMutation({
        mutationFn: async ({ shopId, status }) => {
            const response = await axiosInstance.put(`/shop/status/${shopId}`, { status });
            return response.data?.data ?? {};
        },
    });
};
