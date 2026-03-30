import { configureStore } from '@reduxjs/toolkit'
import adminProductsSlice from './features/adminProductsSlice'
import reviewSlice from './features/reviewSlice'
import tempSlice from './features/tempSlice'
import authSlice from './features/authSlice'
import wishlistSlice from './features/wishlistSlice'
import customizeProductsSlice from './features/customizeProductsSlice'
import cartSlice from './features/cartSlice'
import checkoutSlice from './features/checkoutSlice'
import adminOrdersSlice from './features/adminOrdersSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      adminProducts: adminProductsSlice,
      review: reviewSlice,
      auth: authSlice,
      wishlist: wishlistSlice,
      customizeProducts: customizeProductsSlice,
      cart: cartSlice,
      checkout: checkoutSlice,
      adminOrders: adminOrdersSlice,
      temp:tempSlice, // remove latter is is unused and not needed
    },
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']