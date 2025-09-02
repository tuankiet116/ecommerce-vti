import axiosInstance from "@/api/axiosInstance";
import { HttpStatusCode } from "axios";

export const getVariants = async (page) => {
    let response = await axiosInstance.get("variants/list", {
        params: { page },
    });
    if (response.status !== HttpStatusCode.Ok) {
        throw new Error(`Failed to fetch variants: ${response.statusText}`);
    }
    return response.data;
};

export const bulkUpdateVariants = async (data) => {
    let response = await axiosInstance.post("variants/bulk-update", data);
    if (response.status !== HttpStatusCode.Ok && response.status !== HttpStatusCode.NoContent) {
        throw new Error(`Failed to bulk update variants: ${response.statusText}`);
    }
    return response.data;
};
