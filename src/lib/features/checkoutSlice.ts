import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../lib/store'

// Define a type for the slice state

export interface CheckoutState {
    product?: {
        _id: string;
        name:string;
        description?:string;
        maxPrice:number;
        discountedPrice?:number;
        mainPhoto:string;
        minDeliveryDays?:number;
        maxDeliveryDays?:number;
        badge?:string;
    };
    quantity?: number;
    formData?: {
        data: any;
        images: any;
    };
    processedImage?: string;
}

// Define the initial state using that type

const initialState: CheckoutState = {};

export const checkoutSlice = createSlice({
    name: 'checkout',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setCheckout: (state, action: PayloadAction<CheckoutState>) => {
            state.product = action.payload.product;
            state.quantity = action.payload.quantity;
            state.formData = action.payload.formData;
            state.processedImage = action.payload.processedImage;
        },
        resetCheckout: (state) => {
            state.product = undefined;
            state.quantity = undefined;
            state.formData = undefined;
            state.processedImage = undefined;
        },
        updateQUantity: (state, action: PayloadAction<number>) => {
            state.quantity = action.payload;
        }
    }
})

export const { setCheckout, resetCheckout, updateQUantity } = checkoutSlice.actions;

export default checkoutSlice.reducer;
