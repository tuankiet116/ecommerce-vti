import axiosInstance from "@/api/axiosInstance";
import { HttpStatusCode } from "axios";

export const getCollections = async (search, isActive, page) => {
    let response = await axiosInstance.get("collection/list", {
        params: {
            search: search || "",
            is_active: isActive,
            page: page || 1,
        }
    });
    if (response.status !== HttpStatusCode.Ok) {
        throw new Error(`Failed to fetch collections: ${response.statusText}`);
    }
    return response.data;
};

export const getCollectionById = async (id) => {
    let response = await axiosInstance.get(`collection/detail/${id}`);
    if (response.status !== HttpStatusCode.Ok) {
        throw new Error(`Failed to fetch collection: ${response.statusText}`);
    }
    return response.data;
};

export const createCollection = async (data) => {
    let response = await axiosInstance.post("collection/create", data);
    if (response.status !== HttpStatusCode.Created && response.status !== HttpStatusCode.Ok) {
        throw new Error(`Failed to create collection: ${response.statusText}`);
    }
    return response.data;
}

export const updateCollection = async (id, data) => {
    let response = await axiosInstance.put(`collection/update/${id}`, data);
    if (response.status !== HttpStatusCode.Ok) {
        throw new Error(`Failed to update collection: ${response.statusText}`);
    }
    return response.data;
}

export const deleteCollection = async (id) => {
    let response = await axiosInstance.delete(`collection/delete/${id}`);
    if (response.status !== HttpStatusCode.Ok) {
        throw new Error(`Failed to delete collection: ${response.statusText}`);
    }
    return response.data;
}
