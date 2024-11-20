import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../lib/store'

// Define a type for the slice state

export interface CartState {
    cart: CartItem[];
    isFatched?: boolean;
    totalPrice?: number;
    totalDiscountedPrice?: number;
    totalQuantity?: number;
}

// Define the initial state using that type
const initialState: CartState = {
    cart: [],
    totalPrice: 0,
    totalDiscountedPrice: 0,
    isFatched: false,
    totalQuantity: 0,
}

export const cartSlice = createSlice({
    name: 'cart',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setCart: (state, action: PayloadAction<CartState>) => {
            state.cart = action.payload.cart;
            state.isFatched = true;
            state.totalPrice = action.payload.cart.reduce((acc, item) => acc + item.product.maxPrice * item.quantity, 0);
            state.totalDiscountedPrice = action.payload.cart.reduce((acc, item) => acc + (item.product.discountedPrice || item.product.maxPrice) * item.quantity, 0);
            let totalQuantity = 0;
            action.payload.cart.forEach(item => totalQuantity += item.quantity);
            state.totalQuantity = totalQuantity;
        },
        addCart: (state, action: PayloadAction<CartItem>) => {
            state.cart = [...state.cart, action.payload];
            state.totalPrice = (action.payload.product.maxPrice * action.payload.quantity) + (state.totalPrice || 0);
            state.totalDiscountedPrice = ((action.payload.product.discountedPrice || action.payload.product.maxPrice) * action.payload.quantity) + (state.totalDiscountedPrice || 0);
            state.totalQuantity = (state.totalQuantity || 0) + action.payload.quantity;
        },
        removeCart: (state, action: PayloadAction<string>) => {
            state.cart = state.cart.filter((item) => item._id !== action.payload);
            state.totalPrice = state.cart.reduce((acc, item) => acc + item.product.maxPrice * item.quantity, 0);
            state.totalDiscountedPrice = state.cart.reduce((acc, item) => acc + (item.product.discountedPrice || item.product.maxPrice) * item.quantity, 0);
            let totalQuantity = 0;
            state.cart.forEach(item => totalQuantity += item.quantity);
            state.totalQuantity = totalQuantity;
        },
        updateCart: (state, action: PayloadAction<CartItem>) => {
            state.cart = state.cart.map((item) => item._id === action.payload._id ? action.payload : item);
        },
        updateItemQuantity: (state, action: PayloadAction<{_id: string, quantity: number}>) => {
            state.cart = state.cart.map((item) => item._id === action.payload._id ? {...item, quantity: action.payload.quantity} : item);
            state.totalPrice = state.cart.reduce((acc, item) => acc + item.product.maxPrice * item.quantity, 0);
            state.totalDiscountedPrice = state.cart.reduce((acc, item) => acc + (item.product.discountedPrice || item.product.maxPrice) * item.quantity, 0);
            let totalQuantity = 0;
            state.cart.forEach(item => totalQuantity += item.quantity);
            state.totalQuantity = totalQuantity;
        },
        resetCart: (state) => {
            state.cart = [];
            state.totalPrice = 0;
            state.totalDiscountedPrice = 0;
            state.isFatched = false;
            state.totalQuantity = 0;
        }
    }
})

export const { setCart, addCart, removeCart, updateCart, updateItemQuantity, resetCart } = cartSlice.actions;

// Other code such as selectors can use the imported `RootState` type

export const selectCart = (state: RootState) => state.cart.cart;

export default cartSlice.reducer;
