import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../lib/store'

// Define a type for the slice state

export interface CustomizeProductsState {
    products: ProductViewForCustomization[];
}

// Define the initial state using that type

const initialState: CustomizeProductsState = {
    products: [],
}

export const customizeProductsSlice = createSlice({
    name: 'customizeProducts',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        addProduct: (state, action: PayloadAction<ProductViewForCustomization>) => {
            state.products.push(action.payload);
        },
        removeProduct: (state, action: PayloadAction<string>) => {
            state.products = state.products.filter(product => product._id !== action.payload);
        },
        updateProduct: (state, action: PayloadAction<ProductViewForCustomization>) => {
            const index = state.products.findIndex(product => product._id === action.payload._id);
            state.products[index] = action.payload;
        },
        updateQuantity: (state, action: PayloadAction<{productId: string, quantity: number}>) => {
            const index = state.products.findIndex(product => product._id === action.payload.productId);
            state.products[index].quantity = action.payload.quantity;
        }
    }
})

export const { addProduct, removeProduct, updateProduct, updateQuantity } = customizeProductsSlice.actions

// Other code such as selectors can use the imported `RootState` type

export const selectProducts = (state: RootState) => state.customizeProducts.products;

export default customizeProductsSlice.reducer;