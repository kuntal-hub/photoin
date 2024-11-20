import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../lib/store'

// Define a type for the slice state
export interface ReviewState {
    productReviews: ProductReviews[];
    allReviews: Review[];
    allReviewsPage: number;
    allReviewsHasmore: boolean;
}

// Define the initial state using that type
const initialState: ReviewState = {
    productReviews: [],
    allReviews: [],
    allReviewsPage: 1,
    allReviewsHasmore: false,
}

export const reviewSlice = createSlice({
    name: 'review',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setReviews: (state, action: PayloadAction<ProductReviews>) => {
            const index = state.productReviews.findIndex(pr => pr.productId === action.payload.productId);
            if (index !== -1) {
                state.productReviews[index] = action.payload;
            } else {
                state.productReviews.push(action.payload);
            }
        },
        addReviews: (state, action: PayloadAction<ProductReviews>) => {
            const index = state.productReviews.findIndex(pr => pr.productId === action.payload.productId);
            if (index !== -1) {
                state.productReviews[index].reviews = [...state.productReviews[index].reviews, ...action.payload.reviews];
                state.productReviews[index].page = action.payload.page;
                state.productReviews[index].hasmore = action.payload.hasmore;
            } else {
                state.productReviews.push(action.payload);
            }
        },
        addReview: (state, action: PayloadAction<{productId:string,review:Review}>) => {
            const index = state.productReviews.findIndex(pr => pr.productId === action.payload.productId);
            if (index !== -1) {
                state.productReviews[index].reviews.unshift(action.payload.review);
            } else {
                state.productReviews.push({productId:action.payload.productId,reviews:[action.payload.review],page:1,hasmore:false,isReviewedByMe:false});
            }
        },
        deleteReview: (state, action: PayloadAction<{productId:string,reviewId:string}>) => {
            const index = state.productReviews.findIndex(pr => pr.productId === action.payload.productId);
            if (index !== -1) {
                state.productReviews[index].reviews = state.productReviews[index].reviews.filter(r => r._id !== action.payload.reviewId);
            } 
        },
        setPage: (state, action: PayloadAction<{productId:string,page:number}>) => {
            const index = state.productReviews.findIndex(pr => pr.productId === action.payload.productId);
            if (index !== -1) {
                state.productReviews[index].page = action.payload.page;
            }
        },
        setHasmore: (state, action: PayloadAction<{productId:string,hasmore:boolean}>) => {
            const index = state.productReviews.findIndex(pr => pr.productId === action.payload.productId);
            if (index !== -1) {
                state.productReviews[index].hasmore = action.payload.hasmore;
            }
        },
        setIsReviewedByMe: (state, action: PayloadAction<{productId:string,isReviewedByMe:boolean}>) => {
            const index = state.productReviews.findIndex(pr => pr.productId === action.payload.productId);
            if (index !== -1) {
                state.productReviews[index].isReviewedByMe = action.payload.isReviewedByMe;
            } 
        },
        setAllReviews: (state, action: PayloadAction<{reviews:Review[],page:number,hasMore:boolean}>) => {
            state.allReviews = action.payload.reviews;
            state.allReviewsPage = action.payload.page;
            state.allReviewsHasmore = action.payload.hasMore;
        },
        addReviewsToAllReviews: (state, action: PayloadAction<{reviews:Review[],page:number,hasMore:boolean}>) => {
            state.allReviews = [...state.allReviews, ...action.payload.reviews];
            state.allReviewsPage = action.payload.page;
            state.allReviewsHasmore = action.payload.hasMore;
        },
        addReviewToAllReviews: (state, action: PayloadAction<Review>) => {
            state.allReviews.unshift(action.payload);
        },
        deleteFromAllReviews: (state, action: PayloadAction<string>) => {
            state.allReviews = state.allReviews.filter(r => r._id !== action.payload);
        },
        setAllReviewsPage: (state, action: PayloadAction<number>) => {
            state.allReviewsPage = action.payload;
        },
    }
})

export const { 
    setReviews, 
    addReviews, 
    addReview, 
    setPage, 
    setHasmore, 
    setIsReviewedByMe, 
    setAllReviews,
    addReviewToAllReviews,
    addReviewsToAllReviews,
    deleteFromAllReviews,
    setAllReviewsPage,
    deleteReview } = reviewSlice.actions;

export default reviewSlice.reducer;