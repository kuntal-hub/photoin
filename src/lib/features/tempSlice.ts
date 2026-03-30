import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../lib/store'

// Define a type for the slice state
export interface TempState {
    tempImages: TempImage[];
    cateGoiesName: {
        name: string;
        id: string;
    }[];
}

// Define the initial state using that type
const initialState: TempState = {
    tempImages: [],
    cateGoiesName: [],
}

export const tempSlice = createSlice({
    name: 'temp',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        addToTempState: (state, action: PayloadAction<TempImage>) => {
            state.tempImages.push(action.payload);
        },
        setCategoriesName: (state, action: PayloadAction<{name:string,id:string}[]>) => {
            state.cateGoiesName = action.payload;
        }
    }
})

export const { setCategoriesName } = tempSlice.actions;

export default tempSlice.reducer