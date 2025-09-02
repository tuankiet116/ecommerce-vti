import {
    bulkDeleteProducts,
    bulkUpdateStatus,
    createProduct,
    getProduct,
    getProducts,
    statisticProducts,
    updateProduct,
} from "@/services/productService";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetProducts = (search, status, page) => {
    return useQuery({
        queryKey: ["products", status, page, search],
        queryFn: async () => {
            return await getProducts(search, status, page);
        },
    });
};

export const useGetProduct = (id) => {
    return useQuery({
        queryKey: ["product", id],
        queryFn: async () => {
            let result = await getProduct(id);
            return result.data;
        },
        enabled: !!id && isNaN(Number(id)) === false,
    });
};

export const useGetStatisticsProduct = () => {
    return useQuery({
        queryKey: ["statistics-product"],
        queryFn: async () => {
            return await statisticProducts();
        },
    });
};

export const useCreateProduct = () => {
    return useMutation({
        mutationFn: async (data) => {
            const response = await createProduct(data);
            return response;
        },
    });
};

export const useUpdateProduct = () => {
    return useMutation({
        mutationFn: async ({ id, data }) => {
            const response = await updateProduct(id, data);
            return response;
        },
    });
};

export const useBulkUpdateStatus = () => {
    return useMutation({
        mutationFn: async ({ ids, isActive }) => {
            const response = await bulkUpdateStatus(ids, isActive);
            return response;
        },
    });
};

export const useBulkDeleteProducts = () => {
    return useMutation({
        mutationFn: async ({ ids }) => {
            const response = await bulkDeleteProducts(ids);
            return response;
        },
    });
};
