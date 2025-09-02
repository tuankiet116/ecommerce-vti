import axiosInstance from "@/api/axiosInstance";
import { HttpStatusCode } from "axios";

export const getImages = async (page) => {
    const response = await axiosInstance.get("images/list", {
        params: {
            page: page,
        },
    });
    if (response.status !== HttpStatusCode.Ok) {
        throw new Error(`Error fetching images: ${response.statusText}`);
    }
    return response.data?.data;
};

export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await axiosInstance.post("images/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    if (response.status !== HttpStatusCode.Ok) {
        throw new Error(`Error uploading image: ${response.statusText}`);
    }
    return response.data?.data;
};
