import { RESUL_CODE } from "common/api/api";
import { appActions, RequestStatusType } from "app/app-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { tasksThunks } from "features/TodoListsList/tasks-reducer";
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from "common/utils";
import { TodoListApi, TodoListType } from "features/TodoListsList/todoListApi";

export type FilterValuesType = "all" | "active" | "completed"
export type TodoListDomainType = TodoListType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}

const slice = createSlice({
  name: "todoLists",
  initialState: [] as TodoListDomainType[],
  reducers: {
    // removeTodoList: (state, action: PayloadAction<{ todoListId: string }>) => {
    //   const index = state.findIndex(todo => todo.id === action.payload.todoListId);
    //   if (index !== -1) state.splice(index, 1);
    // },
    // addTodoList: (state, action: PayloadAction<{ todoList: TodoListType }>) => {
    //   const newTodoList: TodoListDomainType = {
    //     ...action.payload.todoList,
    //     filter: "all",
    //     entityStatus: "idle"
    //   };
    //   state.unshift(newTodoList);
    // },
    // changeTodoListTitle: (state, action: PayloadAction<{ todoListId: string, newTitle: string }>) => {
    //   const index = state.findIndex(todo => todo.id === action.payload.todoListId);
    //   if (index !== -1) state[index].title = action.payload.newTitle;
    // },
    changeTodoListFilter: (state, action: PayloadAction<{ todoListId: string, newFilterValue: FilterValuesType }>) => {
      const index = state.findIndex(todo => todo.id === action.payload.todoListId);
      if (index !== -1) state[index].filter = action.payload.newFilterValue;
    },
    changeTodoListStatus: (state, action: PayloadAction<{ todoListId: string, entityStatus: RequestStatusType }>) => {
      const index = state.findIndex(todo => todo.id === action.payload.todoListId);
      if (index !== -1) state[index].entityStatus = action.payload.entityStatus;
    },
    clearTodoListsData: () => {
      return [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTodosTC.fulfilled, (state, action) => {
        action.payload.data.forEach((tl) => {
          state.push({ ...tl, filter: "all", entityStatus: "idle" });
        });
      })
      .addCase(createTodoTC.fulfilled, (state, action) => {
        const newTodoList: TodoListDomainType = {
          ...action.payload.todoList,
          filter: "all",
          entityStatus: "idle"
        };
        state.unshift(newTodoList);
      })
      .addCase(updateTodoTC.fulfilled, (state, action) => {
        const index = state.findIndex(todo => todo.id === action.payload.todoListId);
        if (index !== -1) state[index].title = action.payload.newTitle;
      })
      .addCase(removeTodoTC.fulfilled, (state, action) => {
        const index = state.findIndex(todo => todo.id === action.payload.todoListId);
        if (index !== -1) state.splice(index, 1);
      });
  }
});

// то что удалить

// const initialState: Array<TodoListDomainType> = []

// export const todoListsReducer = (state: Array<TodoListDomainType> = initialState, action: todoListsReducerAT): Array<TodoListDomainType> => {
//     switch (action.type) {
//         case "SET-TODOLIST":
//             return action.data.map(t => ({...t, filter: 'all', entityStatus: "idle"}))
//         case "ADD-TODOLIST":
//             const newTodolist: TodoListDomainType = {
//                 ...action.todoListId,
//                 filter: "all",
//                 entityStatus: "idle"
//             }
//             return [newTodolist, ...state]
//         case "CHANGE-TODOLIST-TITLE":
//             return state.map(tl => tl.id === action.todoListId ? {...tl, title: action.newTitle} : tl)
//         case "CHANGE-TODOLIST-FILTER":
//             return state.map(tl => tl.id === action.todoListId ? {...tl, filter: action.nextFilterValue} : tl)
//         case "CHANGE-TODOLIST-STATUS":
//             return state.map(tl => tl.id === action.todoListId ? {...tl, entityStatus: action.status} : tl)
//         case "REMOVE-TODOLIST":
//             return state.filter(tl => tl.id !== action.todoListId)
//         case "CLEAR-DATA":
//             return []
//         default:
//             return state
//     }
// }
//
// export type RemoveTodoListAT = ReturnType<typeof removeTodoListAC>
// export type AddTodoListsAT = ReturnType<typeof addTodoListAC>
// export type SetTodoListAT = ReturnType<typeof setTodoListAC>
// export type clearTodoListsDataAT = ReturnType<typeof clearTodoListsDataAC>
//
// export type todoListsReducerAT =
//     | RemoveTodoListAT | AddTodoListsAT | SetTodoListAT | clearTodoListsDataAT
//     | ReturnType<typeof changeTodoListTitleAC>
//     | ReturnType<typeof changeTodoListFilterAC>
//     | ReturnType<typeof changeTodoListStatusAC>


// export const removeTodoListAC = (todoListId: string) => (
//     {type: "REMOVE-TODOLIST", todoListId: todoListId} as const
// )
// export const addTodoListAC = (todoListId: TodoListType) => (
//     {type: "ADD-TODOLIST", todoListId} as const
// )
// export const changeTodoListTitleAC = (todoListId: string, newTitle: string) => (
//     {type: "CHANGE-TODOLIST-TITLE", newTitle, todoListId} as const
// )
// export const changeTodoListFilterAC = (nextFilterValue: FilterValuesType, todoListId: string) => (
//     {type: "CHANGE-TODOLIST-FILTER", nextFilterValue, todoListId} as const
// )
// export const changeTodoListStatusAC = (status: RequestStatusType, todoListId: string) => (
//     {type: "CHANGE-TODOLIST-STATUS", status, todoListId} as const
// )
// export const setTodoListAC = (data: TodoListType[]) => (
//     {type: "SET-TODOLIST", data} as const
// )
//
// export const clearTodoListsDataAC = () => (
//     {type: 'CLEAR-DATA'} as const
// )

const getTodosTC = createAppAsyncThunk<{ data: TodoListType[] }>(
  `${slice.name}/getTodosTC`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));

      const res = await TodoListApi.getTodoLists();
      // dispatch(todoListsActions.setTodoList({ data: res.data }));

      const todo = res.data;
      todo.forEach((t) => {
        dispatch(tasksThunks.getTasksTC(t.id));
      });

      return { data: res.data };
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    } finally {
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
    }
  }
);

const createTodoTC = createAppAsyncThunk<{ todoList: TodoListType }, { title: string }>(
  `${slice.name}/createTodoTC`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await TodoListApi.createTodoList(arg.title);
      if (res.data.resultCode === RESUL_CODE.SUCCESS) {
        return { todoList: res.data.data.item };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    } finally {
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
    }
  }
);

// export const _createTodoTC = (title: string): AppThunk => (dispatch) => {
//   dispatch(appActions.setAppStatus({ status: "loading" }));
//   TodoListApi.createTodoList(title)
//     .then((res) => {
//       if (res.data.resultCode === RESUL_CODE.SUCCESS) {
//         dispatch(todoListsActions.addTodoList({ todoList: res.data.data.item }));
//         dispatch(appActions.setAppStatus({ status: "succeeded" }));
//       } else {
//         handleServerAppError(res.data, dispatch);
//       }
//     })
//     .catch((e) => {
//       handleServerNetworkError(e, dispatch);
//     });
// };

const updateTodoTC = createAppAsyncThunk<{ todoListId: string, newTitle: string }, {
  todoId: string,
  newTitle: string
}>(
  `${slice.name}/updateTodoTC`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      dispatch(todoListsActions.changeTodoListStatus({ todoListId: arg.todoId, entityStatus: "loading" }));
      const res = await TodoListApi.updateTodoList(arg.todoId, arg.newTitle);
      if (res.data.resultCode === RESUL_CODE.SUCCESS) {
        return { todoListId: arg.todoId, newTitle: arg.newTitle };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    } finally {
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      dispatch(todoListsActions.changeTodoListStatus({ todoListId: arg.todoId, entityStatus: "idle" }));
    }
  }
);

// export const _updateTodoTC = (todoId: string, newTitle: string): AppThunk => (dispatch) => {
//   dispatch(appActions.setAppStatus({ status: "loading" }));
//   dispatch(todoListsActions.changeTodoListStatus({ todoListId: todoId, entityStatus: "loading" }));
//   TodoListApi.updateTodoList(todoId, newTitle)
//     .then((res) => {
//       if (res.data.resultCode === RESUL_CODE.SUCCESS) {
//         dispatch(todoListsActions.changeTodoListTitle({ todoListId: todoId, newTitle: newTitle }));
//         dispatch(appActions.setAppStatus({ status: "succeeded" }));
//       } else {
//         handleServerAppError(res.data, dispatch);
//       }
//     })
//     .catch((e) => {
//       handleServerNetworkError(e, dispatch);
//     })
//     .finally(() => {
//       dispatch(todoListsActions.changeTodoListStatus({ todoListId: todoId, entityStatus: "idle" }));
//     });
// };

const removeTodoTC = createAppAsyncThunk<{ todoListId: string }, { todoId: string }>(
  `${slice.name}/removeTodoTC`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      dispatch(todoListsActions.changeTodoListStatus({ todoListId: arg.todoId, entityStatus: "loading" }));

      const res = await TodoListApi.deleteTodoList(arg.todoId);

      if (res.data.resultCode === RESUL_CODE.SUCCESS) {
        return { todoListId: arg.todoId };
      } else {
        handleServerAppError(res.data, dispatch);
        dispatch(todoListsActions.changeTodoListStatus({ todoListId: arg.todoId, entityStatus: "idle" }));
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      dispatch(todoListsActions.changeTodoListStatus({ todoListId: arg.todoId, entityStatus: "idle" }));
      return rejectWithValue(null);
    } finally {
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
    }
  }
);

// export const _removeTodoTC = (todoId: string): AppThunk => (dispatch) => {
//   dispatch(appActions.setAppStatus({ status: "loading" }));
//   dispatch(todoListsActions.changeTodoListStatus({ todoListId: todoId, entityStatus: "loading" }));
//   TodoListApi.deleteTodoList(todoId)
//     .then((res) => {
//       if (res.data.resultCode === RESUL_CODE.SUCCESS) {
//         dispatch(todoListsActions.removeTodoList({ todoListId: todoId }));
//         dispatch(appActions.setAppStatus({ status: "succeeded" }));
//       } else {
//         handleServerAppError(res.data, dispatch);
//         dispatch(todoListsActions.changeTodoListStatus({ todoListId: todoId, entityStatus: "idle" }));
//       }
//     })
//     .catch((e) => {
//       handleServerNetworkError(e, dispatch);
//       dispatch(todoListsActions.changeTodoListStatus({ todoListId: todoId, entityStatus: "idle" }));
//     });
// };

export const todoListsReducer = slice.reducer;
export const todoListsActions = slice.actions;
export const todoListsThunks = { getTodosTC, createTodoTC, updateTodoTC, removeTodoTC };
