import { createCollection, deleteCollection, getCollectionById, getCollections, updateCollection } from "@/services/collectionService";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetCollections = (searchValue, isActive, page) => {
    return useQuery({
        queryKey: ["collections", searchValue],
        queryFn: async () => {
            try {
                let result = await getCollections(searchValue, isActive, page);
                return result?.data ?? [];
            } catch (error) {
                return [];
            }
        },
    });
};

export const useGetCollectionById = (id) => {
    return useQuery({
        queryKey: ["collection", id],
        queryFn: async () => {
            try {
                let result = await getCollectionById(id);
                return result?.data ?? null;
            } catch (error) {
                return null;
            }
        },
        enabled: !!id && isNaN(Number(id)) === false,
    });
};

export const useCreateCollection = () => {
    return useMutation({
        mutationFn: async (data) => {
            try {
                let result = await createCollection(data);
                return result?.data ?? null;
            } catch (error) {
                throw error.response;
            }
        },
    });
};

export const useUpdateCollection = (id) => {
    return useMutation({
        mutationFn: async (data) => {
            try {
                let result = await updateCollection(id, data);
                return result?.data ?? null;
            } catch (error) {
                throw error.response;
            }
        },
    });
};

export const useDeleteCollection = () => {
    return useMutation({
        mutationFn: async (id) => {
            try {
                let result = await deleteCollection(id);
                return result?.data ?? null;
            } catch (error) {
                throw error.response;
            }
        },
    });
}