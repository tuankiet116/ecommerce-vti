import axiosInstance from "@/api/axiosInstance";

export const getProducts = async (search = "", status = null, page = 1) => {
    try {
        const response = await axiosInstance.get("/product/list", { params: { page, is_active: status, search } });
        return response.data;
    } catch (error) {
        throw error.response;
    }
};

export const getProduct = async (id) => {
    try {
        const response = await axiosInstance.get(`/product/detail/${id}`);
        return response.data;
    } catch (error) {
        throw error.response;
    }
};

export const statisticProducts = async () => {
    try {
        const response = await axiosInstance.get("/product/statistics");
        return response.data;
    } catch (error) {
        throw error.response;
    }
};

export const createProduct = async (data) => {
    try {
        const response = await axiosInstance.post("/product/create", data);
        return response.data;
    } catch (error) {
        throw error.response;
    }
};

export const updateProduct = async (id, data) => {
    try {
        const response = await axiosInstance.put(`/product/update/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response;
    }
};

export const bulkUpdateStatus = async (ids, isActive) => {
    try {
        const response = await axiosInstance.post("/product/bulk-update-status", {
            ids: ids,
            is_active: isActive,
        });
        return response.data;
    } catch (error) {
        throw error.response;
    }
};

export const bulkDeleteProducts = async (ids) => {
    try {
        const response = await axiosInstance.post("/product/bulk-delete", { ids });
        return response.data;
    } catch (error) {
        throw error.response;
    }
};
