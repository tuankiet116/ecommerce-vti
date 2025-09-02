import { createSlice } from "@reduxjs/toolkit";

export const variantSlice = createSlice({
    name: "variants",
    initialState: {
        variants: [],
    },
    reducers: {
        setVariants: (state, action) => {
            state.variants = action.payload;
        },
        setVariantAttribute: (state, action) => {
            const { index, attribute, value } = action.payload;
            state.variants[index][attribute] = value;
        },
    },
});

export const variantActions = variantSlice.actions;

export default variantSlice.reducer;
