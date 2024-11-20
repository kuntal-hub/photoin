import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../lib/store'

// Define a type for the slice state

export interface WishlistState {
    wishlist: ProductView[];
    page: number;
    hasMore: boolean;
    isFatched?: boolean;
}

// Define the initial state using that type

const initialState: WishlistState = {
    wishlist: [],
    page: 1,
    hasMore: false,
    isFatched: false,
}

export const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        addWishlist: (state, action: PayloadAction<ProductView>) => {
            state.wishlist.push(action.payload)
        },
        removeWishlist: (state, action: PayloadAction<string>) => {
            state.wishlist = state.wishlist.filter((product) => product._id !== action.payload)
        },
        setWishlist: (state, action: PayloadAction<WishlistState>) => {
            state.wishlist = action.payload.wishlist
            state.page = action.payload.page
            state.hasMore = action.payload.hasMore
            state.isFatched = true
        },
        addProtoductsToWishlist: (state, action: PayloadAction<WishlistState>) => {
            state.wishlist = [...state.wishlist, ...action.payload.wishlist]
            state.page = action.payload.page
            state.hasMore = action.payload.hasMore
            state.isFatched = true
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload
        },
        setHasMore: (state, action: PayloadAction<boolean>) => {
            state.hasMore = action.payload
        },
    },
})

export const { addWishlist, removeWishlist, setWishlist, addProtoductsToWishlist, setPage, setHasMore } = wishlistSlice.actions

// Other code such as selectors can use the imported `RootState` type

export const selectWishlist = (state: RootState) => state.wishlist.wishlist

export const selectPage = (state: RootState) => state.wishlist.page

export const selectHasMore = (state: RootState) => state.wishlist.hasMore

export default wishlistSlice.reducer