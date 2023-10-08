import { tasksReducer } from "features/TodoListsList/model/tasks-reducer";
import { todoListsReducer } from "features/TodoListsList/model/todolists-reducer";
import { AnyAction } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { appReducer } from "app/app-reducer";
import { authReducer } from "features/Login/model/auth-reducer";
import { configureStore } from "@reduxjs/toolkit";

// const rootReducer = combineReducers({
//   tasks: tasksReducer,
//   todoLists: todoListsReducer,
//   app: appReducer,
//   auth: authReducer
// });

// export const store = legacy_createStore(rootReducer, applyMiddleware(thunk)); redux
export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    todoLists: todoListsReducer,
    app: appReducer,
    auth: authReducer
  }
});

export type AppRootStateType = ReturnType<typeof store.getState>

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AnyAction>

export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AnyAction>

export const useAppDispatch = useDispatch<AppDispatch>;
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector;


// @ts-ignore
window.store = store;