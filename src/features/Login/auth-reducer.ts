import { appActions } from "app/app-reducer";
import { RESUL_CODE } from "common/api/api";
import { LoginDataType } from "features/Login/Login";
import { createSlice } from "@reduxjs/toolkit";
import { todoListsActions } from "features/TodoListsList/todolists-reducer";
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from "common/utils";
import { authAPI } from "features/Login/authApi";

// const initialState = {
//   isLoggedIn: false
// };
// type InitialStateType = typeof initialState


const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(initializeApp.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      });
  }
});

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
const login = createAppAsyncThunk<{ isLoggedIn: boolean }, { data: LoginDataType }>(
  `${slice.name}/login`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const result = await authAPI.login(arg.data);
      if (result.data.resultCode === RESUL_CODE.SUCCESS) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        return { isLoggedIn: true };
      } else {
        handleServerAppError(result.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e as { message: string }, dispatch);
      return rejectWithValue(null);
    }
  }
);

const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
  `${slice.name}/logout`,
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const result = await authAPI.logout();
      if (result.data.resultCode === RESUL_CODE.SUCCESS) {
        dispatch(todoListsActions.clearTodoListsData());
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        return { isLoggedIn: false };
      } else {
        handleServerAppError(result.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e as { message: string }, dispatch);
      return rejectWithValue(null);
    }
  }
);

const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
  `${slice.name}/initializeApp`,
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      const res = await authAPI.me();
      if (res.data.resultCode === 0) {
        return { isLoggedIn: true };
      } else {
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e as { message: string }, dispatch);
      return rejectWithValue(null);
    } finally {
      dispatch(appActions.setInitialized({ isInitialized: true }));
    }
  }
);

// export const loginTC = (data: LoginDataType): AppThunk => async (dispatch) => {
//   dispatch(appActions.setAppStatus({ status: "loading" }));
//   try {
//     const result = await authAPI.login(data);
//     if (result.data.resultCode === RESUL_CODE.SUCCESS) {
//       dispatch(appActions.setAppStatus({ status: "succeeded" }));
//       dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }));
//     } else {
//       handleServerAppError(result.data, dispatch);
//     }
//   } catch (e) {
//     handleServerNetworkError(e as { message: string }, dispatch);
//   }
// };
//
// export const logoutTC = (): AppThunk => async (dispatch) => {
//   dispatch(appActions.setAppStatus({ status: "loading" }));
//   try {
//     const result = await authAPI.logout();
//     if (result.data.resultCode === RESUL_CODE.SUCCESS) {
//       dispatch(appActions.setAppStatus({ status: "succeeded" }));
//       dispatch(authActions.setIsLoggedIn({ isLoggedIn: false }));
//       dispatch(todoListsActions.clearTodoListsData());
//     } else {
//       handleServerAppError(result.data, dispatch);
//     }
//   } catch (e) {
//     handleServerNetworkError(e as { message: string }, dispatch);
//   }
// };

export const authReducer = slice.reducer;
export const authActions = slice.actions;
export const authThunks = { login, logout, initializeApp };