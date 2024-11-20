import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../lib/store'

// Define a type for the slice state

export interface AuthState {
    userId: string | null;
    adminId: string | null;
}

// Define the initial state using that type

const initialState: AuthState = {
    userId: null,
    adminId: null
}

export const authSlice = createSlice({
    name: 'auth',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setUserId: (state, action: PayloadAction<string | null>) => {
            state.userId = action.payload;
        },
        setAdminId: (state, action: PayloadAction<string | null>) => {
            state.adminId = action.payload;
        },
        reset: (state) => {
            state.userId = null;
            state.adminId = null;
        }
    }
})

export const { setUserId, setAdminId, reset } = authSlice.actions

// Other code such as selectors can use the imported `RootState` type

export const selectUserId = (state: RootState) => state.auth.userId;

export const selectAdminId = (state: RootState) => state.auth.adminId;

export default authSlice.reducer;