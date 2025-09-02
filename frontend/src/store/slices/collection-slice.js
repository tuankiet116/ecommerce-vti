import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    name: "",
    description: "",
    is_active: true,
};

export const collectionSlice = createSlice({
    name: "collection",
    initialState: initialState,
    reducers: {
        setCollection: (state, action) => {
            return action.payload;
        },
        setCollectionAttribute: (state, action) => {
            const { attribute, value } = action.payload;
            state[attribute] = value;
        },
        discardCollectionToInitial: (state) => {
            return initialState;
        },
    },
});

export const collectionActions = collectionSlice.actions;

export default collectionSlice.reducer;
