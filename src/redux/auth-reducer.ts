import { appActions } from "./app-reducer";
import { authAPI, RESUL_CODE } from "../api/api";
import { handleServerAppError, handleServerNetworkError } from "../utils/error-utils";
import { LoginDataType } from "../features/Login/Login";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "redux/store";
import { todoListsActions } from "redux/todolists-reducer";

// const initialState = {
//   isLoggedIn: false
// };
// type InitialStateType = typeof initialState


const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false
  },
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    }
  }
});

export const authReducer = slice.reducer;
export const authActions = slice.actions;

// export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
//   switch (action.type) {
//     case "login/SET-IS-LOGGED-IN":
//       return { ...state, isLoggedIn: action.value };
//     default:
//       return state;
//   }
// };

// type ActionsType = ReturnType<typeof setIsLoggedInAC> | SetAppStatusAT | clearTodoListsDataAT
// export const setIsLoggedInAC = (value: boolean) =>
//   ({ type: "login/SET-IS-LOGGED-IN", value } as const);

// thunks
export const loginTC = (data: LoginDataType): AppThunk => async (dispatch) => {
  dispatch(appActions.setAppStatus({ status: "loading" }));
  try {
    const result = await authAPI.login(data);
    if (result.data.resultCode === RESUL_CODE.SUCCESS) {
      dispatch(appActions.setAppStatus({ status: "succeeded"}));
      dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
    } else {
      handleServerAppError(result.data, dispatch);
    }
  } catch (e) {
    handleServerNetworkError(e as { message: string }, dispatch);
  }
};

export const logoutTC = (): AppThunk => async (dispatch) => {
  dispatch(appActions.setAppStatus({ status: "loading" }));
  try {
    const result = await authAPI.logout();
    if (result.data.resultCode === RESUL_CODE.SUCCESS) {
      dispatch(appActions.setAppStatus({ status: "succeeded"}));
      dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
      dispatch(todoListsActions.clearTodoListsData());
    } else {
      handleServerAppError(result.data, dispatch);
    }
  } catch (e) {
    handleServerNetworkError(e as { message: string }, dispatch);
  }
};