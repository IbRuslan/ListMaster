import {Dispatch} from "redux";
import {setAppStatusAC, SetAppStatusAT} from "./app-reducer";
import {authAPI, RESUL_CODE} from "../api/api";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {LoginDataType} from "../features/Login/Login";
import {clearTodoListsDataAC, clearTodoListsDataAT} from "./todolists-reducer";

const initialState = {
    isLoggedIn: false
}
type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}
type ActionsType = ReturnType<typeof setIsLoggedInAC> | SetAppStatusAT | clearTodoListsDataAT
// action
export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const)

// thunks
export const loginTC = (data: LoginDataType) => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    try {
        const result = await authAPI.login(data)
        if (result.data.resultCode === RESUL_CODE.SUCCESS) {
            dispatch(setAppStatusAC('succeeded'))
            dispatch(setIsLoggedInAC(true))
        } else {
            handleServerAppError(result.data, dispatch)
        }
    } catch (e) {
        handleServerNetworkError(e as { message: string }, dispatch)
    }
}

export const logoutTC = () => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    try {
        const result = await authAPI.logout()
        if (result.data.resultCode === RESUL_CODE.SUCCESS) {
            dispatch(setAppStatusAC('succeeded'))
            dispatch(setIsLoggedInAC(false))
            dispatch(clearTodoListsDataAC())
        } else {
            handleServerAppError(result.data, dispatch)
        }
    } catch (e) {
        handleServerNetworkError(e as { message: string }, dispatch)
    }
}