import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    name: "",
    description: "",
    is_active: true,
    variants: [
        {
            id: "",
            name: "Default",
            sku: "",
            price: 0,
            compare_at_price: 0,
            inventory_quantity: 0,
            is_active: true,
            is_default: false,
            option_values: [],
            images: [],
        },
    ],
    options: [],
    category_id: null,
    collection_ids: [],
    images: [],
};

export const productSlice = createSlice({
    name: "product",
    initialState: initialState,
    reducers: {
        setProduct: (state, action) => {
            return action.payload;
        },
        setProductAttribute: (state, action) => {
            const { attribute, value } = action.payload;
            state[attribute] = value;
        },
        discardProductToInitial: (state) => {
            return initialState;
        },
    },
});

export const productActions = productSlice.actions;

export default productSlice.reducer;
