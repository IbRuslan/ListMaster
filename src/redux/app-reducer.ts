import {authAPI} from "../api/api";
import {Dispatch} from "redux";
import {setIsLoggedInAC} from "./auth-reducer";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as null | string,
    isInitialized: false
}

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case 'APP/SET-INITIALIZED':
            return {...state, isInitialized: action.isInitialized}
        default:
            return state
    }
}

type ActionsType = SetAppStatusAT | SetAppErrorAT | setInitializedAT

export type SetAppStatusAT = ReturnType<typeof setAppStatusAC>
export type SetAppErrorAT = ReturnType<typeof setAppErrorAC>
export type setInitializedAT = ReturnType<typeof setInitializedAC>

export const setAppStatusAC = (status: RequestStatusType) => (
    {type: 'APP/SET-STATUS', status} as const
)
export const setAppErrorAC = (error: null | string) => (
    {type: 'APP/SET-ERROR', error} as const
)
export const setInitializedAC = (isInitialized: boolean) => (
    {type: 'APP/SET-INITIALIZED', isInitialized} as const
)

export const initializeAppTC = () => (dispatch: Dispatch) => {
    authAPI.me()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(true));
            } else {
            }
        })
        .finally(() => {
            dispatch(setInitializedAC(true))
        })
}