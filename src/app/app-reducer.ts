import {authAPI} from "api/api";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "redux/store";
import { authActions } from "redux/auth-reducer";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

// const initialState = {
//     status: 'idle' as RequestStatusType,
//     error: null as null | string,
//     isInitialized: false
// }
//
// type InitialStateType = typeof initialState


const slice = createSlice({
    name: 'app',
    initialState: {
        status: 'idle' as RequestStatusType,
        error: null as null | string,
        isInitialized: false
    },
    reducers: {
        setAppStatus: (state, action: PayloadAction<{status: RequestStatusType}>) => {
            state.status = action.payload.status
        },
        setAppError: (state, action: PayloadAction<{error: null | string}>) => {
            state.error = action.payload.error
        },
        setInitialized: (state, action: PayloadAction<{isInitialized: boolean}>) => {
            state.isInitialized = action.payload.isInitialized
        }
    }
})

export type AppInitialStateType = ReturnType<typeof slice.getInitialState>

export const appReducer = slice.reducer
export const appActions = slice.actions

// export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
//     switch (action.type) {
//         case 'APP/SET-STATUS':
//             return {...state, status: action.status}
//         case 'APP/SET-ERROR':
//             return {...state, error: action.error}
//         case 'APP/SET-INITIALIZED':
//             return {...state, isInitialized: action.isInitialized}
//         default:
//             return state
//     }
// }

// type ActionsType = SetAppStatusAT | SetAppErrorAT | setInitializedAT
// //
// // export type SetAppStatusAT = ReturnType<typeof setAppStatusAC>
// // export type SetAppErrorAT = ReturnType<typeof setAppErrorAC>
// // export type setInitializedAT = ReturnType<typeof setInitializedAC>
// //
// // export const setAppStatusAC = (status: RequestStatusType) => (
// //     {type: 'APP/SET-STATUS', status} as const
// // )
// // export const setAppErrorAC = (error: null | string) => (
// //     {type: 'APP/SET-ERROR', error} as const
// // )
// // export const setInitializedAC = (isInitialized: boolean) => (
// //     {type: 'APP/SET-INITIALIZED', isInitialized} as const
// // )

export const initializeAppTC = (): AppThunk => (dispatch) => {
    authAPI.me()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
            } else {
            }
        })
        .finally(() => {
            // dispatch(setInitializedAC(true))
            dispatch(appActions.setInitialized({isInitialized: true}))
        })
}