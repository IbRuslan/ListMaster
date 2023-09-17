import {tasksReducer} from './tasks-reducer';
import {todoListsReducer} from './todolists-reducer';
import {AnyAction, applyMiddleware, combineReducers, legacy_createStore} from 'redux';
import thunk, { ThunkAction, ThunkDispatch } from "redux-thunk";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {appReducer} from "./app-reducer";
import {authReducer} from "./auth-reducer";
import { configureStore } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todoLists: todoListsReducer,
    app: appReducer,
    auth: authReducer
})

// export const store = legacy_createStore(rootReducer, applyMiddleware(thunk)); redux
export const store = configureStore({ reducer: rootReducer })

export type AppRootStateType = ReturnType<typeof rootReducer>

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AnyAction>

export type ThunkType = ThunkDispatch<AppRootStateType, any, AnyAction>
export const useAppDispatch = useDispatch<ThunkType>
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector;

// @ts-ignore
window.store = store;