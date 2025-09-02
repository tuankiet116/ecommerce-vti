import { configureStore } from "@reduxjs/toolkit";
import producrReducer from "./slices/product-slice";
import collectionReducer from "./slices/collection-slice";
import variantsReducer from "./slices/variant-slice";

export const store = configureStore({
    reducer: {
        product: producrReducer,
        collection: collectionReducer,
        variant: variantsReducer,
    },
});
