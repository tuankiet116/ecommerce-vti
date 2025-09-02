// hooks/useImages.js
import { getImages, uploadImage } from "@/services/imageService";
import { useMutation, useQuery } from "@tanstack/react-query";

// hooks/useImages.js
export const useGetImages = (page) => {
    return useQuery({
        queryKey: ["images", page],
        queryFn: async () => await getImages(page),
        keepPreviousData: true,
    });
};

export const useUploadImage = () => {
    return useMutation({
        mutationFn: async (file) => await uploadImage(file),
        onSuccess: () => {
            // Success actions
        },
        onError: (error) => {
            // Error actions
        },
    });
};
