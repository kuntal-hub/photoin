import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../lib/store'

// Define a type for the slice state
export interface AdminProductsState {
    products: ProductView[];
    page: number;
    hasmore: boolean;
    isFatched?: boolean;
}

// Define the initial state using that type
const initialState: AdminProductsState = {
    products: [],
    page: 1,
    hasmore: false,
    isFatched: false,
}

export const adminProductsSlice = createSlice({
    name: 'adminProducts',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setProducts: (state, action: PayloadAction<AdminProductsState>) => {
            state.products = action.payload.products;
            state.page = action.payload.page;
            state.hasmore = action.payload.hasmore;
            state.isFatched = true;
        },
        addProducts: (state, action: PayloadAction<AdminProductsState>) => {
            state.products = [...state.products, ...action.payload.products];
            state.page = action.payload.page;
            state.hasmore = action.payload.hasmore;
            state.isFatched = true;
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        setHasmore: (state, action: PayloadAction<boolean>) => {
            state.hasmore = action.payload;
        }
    }
})

export const { setProducts, addProducts, setPage, setHasmore } = adminProductsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectProducts = (state: RootState) => state.adminProducts.products;

export const selectPage = (state: RootState) => state.adminProducts.page;

export const selectHasmore = (state: RootState) => state.adminProducts.hasmore;

export default adminProductsSlice.reducer;

