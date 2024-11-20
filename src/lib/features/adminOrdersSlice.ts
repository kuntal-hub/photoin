import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../lib/store'

// Define a type for the slice state
export interface AdminOrdersState {
    orders: AdminOrder[];
    days: number;
    status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'all';
    paymentMethod: 'cod' | 'online' | 'all';
    paymentStatus: 'pending' | 'completed' | 'failed' | 'all';
    deliveryStatus: 'ordered' | 'shipped' | 'outOfDelivery' | 'delivered' | 'all';
    searchedEmail?: string;
    page: number;
    hasmore: boolean;
    isFatched?: boolean;
}

// Define the initial state using that type
const initialState: AdminOrdersState = {
    orders: [],
    days: 7,
    status: 'all',
    paymentMethod: 'all',
    paymentStatus: 'all',
    deliveryStatus: 'all',
    page: 1,
    hasmore: false,
    isFatched: false,
}

export const adminOrdersSlice = createSlice({
    name: 'adminOrders',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setOrders: (state, action: PayloadAction<AdminOrdersState>) => {
            state.orders = action.payload.orders;
            state.days = action.payload.days;
            state.status = action.payload.status;
            state.paymentMethod = action.payload.paymentMethod;
            state.paymentStatus = action.payload.paymentStatus;
            state.deliveryStatus = action.payload.deliveryStatus;
            state.searchedEmail = action.payload.searchedEmail;
            state.page = action.payload.page;
            state.hasmore = action.payload.hasmore;
            state.isFatched = true;
        },
        addOrders: (state, action: PayloadAction<AdminOrdersState>) => {
            state.orders = [...state.orders, ...action.payload.orders];
            state.days = action.payload.days;
            state.status = action.payload.status;
            state.paymentMethod = action.payload.paymentMethod;
            state.paymentStatus = action.payload.paymentStatus;
            state.deliveryStatus = action.payload.deliveryStatus;
            state.searchedEmail = action.payload.searchedEmail;
            state.page = action.payload.page;
            state.hasmore = action.payload.hasmore;
            state.isFatched = true;
        },
        setDays: (state, action: PayloadAction<number>) => {
            state.days = action.payload;
            state.isFatched = false;
            state.page = 1;
            state.searchedEmail = '';
        },
        setStatus: (state, action: PayloadAction<'pending' | 'processing' | 'completed' | 'cancelled' | 'all'>) => {
            state.status = action.payload;
            state.isFatched = false;
            state.page = 1;
            state.searchedEmail = '';
        },
        setPaymentMethod: (state, action: PayloadAction<'cod' | 'online' | 'all'>) => {
            state.paymentMethod = action.payload;
            state.isFatched = false;
            state.page = 1;
            state.searchedEmail = '';
        },
        setPaymentStatus: (state, action: PayloadAction<'pending' | 'completed' | 'failed' | 'all'>) => {
            state.paymentStatus = action.payload;
            state.isFatched = false;
            state.page = 1;
            state.searchedEmail = '';
        },
        setDeliveryStatus: (state, action: PayloadAction<'ordered' | 'shipped' | 'outOfDelivery' | 'delivered' | 'all'>) => {
            state.deliveryStatus = action.payload;
            state.isFatched = false;
            state.page = 1;
            state.searchedEmail = '';
        },
        setSearchedEmail: (state, action: PayloadAction<string>) => {
            state.searchedEmail = action.payload;
            state.isFatched = false;
            state.page = 1;
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        updateOrderStatus: (state, action: PayloadAction<{ orderId: string, status: 'pending' | 'processing' | 'completed' | 'cancelled' }>) => {
            const order = state.orders.find(order => order._id === action.payload.orderId);
            if (order) {
                order.status = action.payload.status;
            }
        },
        updateOrderPaymentStatus: (state, action: PayloadAction<{ orderId: string, paymentStatus: 'pending' | 'completed' | 'failed' }>) => {
            const order = state.orders.find(order => order._id === action.payload.orderId);
            if (order) {
                order.paymentStatus = action.payload.paymentStatus;
            }
        },
        updateOrderDeliveryStatus: (state, action: PayloadAction<{ orderId: string, deliveryStatus: 'ordered' | 'shipped' | 'outOfDelivery' | 'delivered' }>) => {
            const order = state.orders.find(order => order._id === action.payload.orderId);
            if (order) {
                order.deliveryStatus = action.payload.deliveryStatus;
            }
        },
        deleteOrder: (state, action: PayloadAction<string>) => {
            state.orders = state.orders.filter(order => order._id !== action.payload);
        },
        resetAll: (state) => {
            state.orders = [];
            state.days = 7;
            state.status = 'all';
            state.paymentMethod = 'all';
            state.paymentStatus = 'all';
            state.deliveryStatus = 'all';
            state.searchedEmail = '';
            state.page = 1;
            state.hasmore = false;
            state.isFatched = false;
        }
    } 
})  

export const { 
    setOrders, 
    addOrders, 
    setDays, 
    setStatus, 
    setPaymentMethod, 
    setPaymentStatus, 
    setDeliveryStatus, 
    setSearchedEmail, 
    setPage,
    updateOrderStatus,
    updateOrderPaymentStatus,
    updateOrderDeliveryStatus,
    deleteOrder,
    resetAll,
 } = adminOrdersSlice.actions;

export default adminOrdersSlice.reducer;