import { RESUL_CODE, TaskPriorities, TaskStatuses } from "common/api/api";
import { appActions, RequestStatusType } from "app/app-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { todoListsActions, todoListsThunks } from "features/TodoListsList/todolists-reducer";
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from "common/utils";
import { TasksApi, TaskType, UpdateTaskType } from "features/TodoListsList/todoListApi";

export type TaskStateType = {
  [id: string]: Array<TasksDomainType>
}

export type TasksDomainType = TaskType & {
  entityStatus: RequestStatusType
}

const slice = createSlice({
  name: "tasks",
  initialState: {} as TaskStateType,
  reducers: {
    changeTaskEntityStatus: (state, action: PayloadAction<{
      todoListId: string,
      id: string,
      status: RequestStatusType
    }>) => {
      const tasksForCurrentTodoList = state[action.payload.todoListId];
      const index = tasksForCurrentTodoList.findIndex(t => t.id === action.payload.id);
      if (index !== -1) tasksForCurrentTodoList[index].entityStatus = action.payload.status;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTasksTC.fulfilled, (state, action) => {
        const tasksForCurrentTodoList = state[action.payload.todolistId];
        action.payload.tasks.forEach(t => {
          tasksForCurrentTodoList.push({ ...t, entityStatus: "idle" });
        });
      })
      .addCase(createTaskTC.fulfilled, (state, action) => {
        const tasksForCurrentTodoList = state[action.payload.task.todoListId];
        const newTask: TasksDomainType = {
          ...action.payload.task,
          entityStatus: "idle"
        };
        tasksForCurrentTodoList.unshift(newTask);
      })
      .addCase(updateTaskTC.fulfilled, (state, action) => {
        const tasks = state[action.payload.todolistId];
        const index = tasks.findIndex((t) => t.id === action.payload.taskId);
        if (index !== -1) {
          tasks[index] = { ...tasks[index], ...action.payload.domainModel };
        }
      })
      .addCase(deleteTaskTC.fulfilled, (state, action) => {
        const tasksForCurrentTodoList = state[action.payload.todoListId];
        const index = tasksForCurrentTodoList.findIndex(t => t.id === action.payload.taskId);
        if (index !== -1) tasksForCurrentTodoList.splice(index, 1);
      })
      .addCase(todoListsThunks.createTodoTC.fulfilled, (state, action) => {
        state[action.payload.todoList.id] = [];
      })
      .addCase(todoListsThunks.removeTodoTC.fulfilled, (state, action) => {
        delete state[action.payload.todoListId];
      })
      .addCase(todoListsThunks.getTodosTC.fulfilled, (state, action) => {
        action.payload.data.forEach(tl => {
          state[tl.id] = [];
        });
      })
      .addCase(todoListsActions.clearTodoListsData, () => {
        return {};
      });
  }
});


// const initialState: TaskStateType = {}
//
// export const tasksReducer = (state: TaskStateType = initialState, action: tasksReducerAT): TaskStateType => {
//     switch (action.type) {
//         case "SET-TODOLIST":
//             const copyState = {...state}
//             action.data.forEach((t: any) => {
//                 copyState[t.id] = []
//             })
//             return copyState
//         case "SET-TASKS":
//             return {
//                 ...state,
//                 [action.todoId]: action.tasks.map((t: any) => ({...t, entityStatus: 'idle'}))
//             }
//         case "REMOVE-TASKS":
//             return {...state, [action.todoListId]: state[action.todoListId].filter(t => t.id !== action.id)}
//         case "ADD-TASKS":
//             const newTask: TasksDomainType = {
//                 ...action.task,
//                 entityStatus: 'idle'
//             }
//             return {...state, [action.todoListId]: [newTask, ...state[action.todoListId]]}
//         case "CHANGE-TASKS-STATUS":
//             return {...state, [action.todoListId]: state[action.todoListId]
//                     .map(t => t.id === action.id ? {...t, status: action.status} : t)
//             }
//         case "CHANGE-TASKS-TITLE":
//             return {...state, [action.todoListId]: state[action.todoListId]
//                     .map(t => t.id === action.id ? {...t, title: action.newTitle} : t)
//             }
//         case "CHANGE-TASKS-ENTITY-STATUS":
//             return {...state, [action.todoListId]: state[action.todoListId]
//                     .map(t => t.id === action.id ? {...t, entityStatus: action.status} : t)
//             }
//         case "ADD-TODOLIST":
//             return {...state, [action.todoListId.id]: []}
//         case "REMOVE-TODOLIST":
//             // let {[action.todoListId]: [], ...rest} = state
//             // return rest
//             let stateCopy = {...state}
//             delete stateCopy[action.todoListId]
//             return stateCopy
//         case "CLEAR-DATA":
//             return {}
//         default:
//             return state
//     }
// }
//
// export type RemoveTasksAT = ReturnType<typeof removeTaskAC>
//
// export type AddTasksAT = ReturnType<typeof addTaskAC>
//
// export type ChangeTasksTitleAT = ReturnType<typeof changeTaskTitleAC>
//
// export type ChangeTasksStatusAT = ReturnType<typeof changeTaskStatusAC>
//
// export type changeTaskEntityStatusAT = ReturnType<typeof changeTaskEntityStatusAC>
//
// export type SetTasksAt = ReturnType<typeof setTasksAC>
//
// export type tasksReducerAT =
//     | RemoveTasksAT | AddTasksAT
//     | ChangeTasksTitleAT | ChangeTasksStatusAT
//     | SetTasksAt | changeTaskEntityStatusAT | any
//
// export const removeTaskAC = (todoListId: string, id: string) => (
//     {type: "REMOVE-TASKS", todoListId: todoListId, id: id} as const
// )
// export const addTaskAC = (task: TaskType, todoListId: string) => (
//   { type: "ADD-TASKS", task, todoListId } as const
// );
// export const changeTaskTitleAC = (newTitle: string, todoListId: string, id: string) => (
//   { type: "CHANGE-TASKS-TITLE", newTitle: newTitle, todoListId: todoListId, id } as const
// );
// export const changeTaskStatusAC = (status: TaskStatuses, todoListId: string, id: string) => (
//   { type: "CHANGE-TASKS-STATUS", status, todoListId, id } as const
// );
// export const changeTaskEntityStatusAC = (status: RequestStatusType, todoListId: string, id: string) => (
//   { type: "CHANGE-TASKS-ENTITY-STATUS", status, todoListId, id } as const
// );
// export const setTasksAC = (tasks: TaskType[], todoId: string) => (
//   { type: "SET-TASKS", todoId, tasks } as const
// );

const getTasksTC = createAppAsyncThunk<{ tasks: TaskType[]; todolistId: string }, string>(
  `${slice.name}/getTasksTC`,
  async (todolistId, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await TasksApi.getTasks(todolistId);
      // dispatch(tasksActions.setTasks({ todoListId: todoId, tasks: res.data.items }));
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { tasks: res.data.items, todolistId };
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  });

// export const _getTasksTC = (todoId: string): AppThunk => (dispatch) => {
//   dispatch(appActions.setAppStatus({ status: "loading" }));
//   TasksApi.getTasks(todoId)
//     .then((res) => {
//       dispatch(tasksActions.setTasks({ todoListId: todoId, tasks: res.data.items }));
//       dispatch(appActions.setAppStatus({ status: "succeeded" }));
//     })
//     .catch((e) => {
//       handleServerNetworkError(e, dispatch);
//     });
// };

const createTaskTC = createAppAsyncThunk<{ task: TaskType }, { todoId: string, title: string }>(
  `${slice.name}/createTaskTC`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await TasksApi.createTask(arg.todoId, arg.title);
      if (res.data.resultCode === RESUL_CODE.SUCCESS) {
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
        return { task: res.data.data.item };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  }
);

// export const _createTaskTC = (todoId: string, title: string): AppThunk => (dispatch) => {
//   dispatch(appActions.setAppStatus({ status: "loading" }));
//   TasksApi.createTask(todoId, title)
//     .then((res) => {
//       if (res.data.resultCode === RESUL_CODE.SUCCESS) {
//         dispatch(tasksActions.addTask({ todoListId: todoId, task: res.data.data.item }));
//         dispatch(appActions.setAppStatus({ status: "succeeded" }));
//       } else {
//         handleServerAppError(res.data, dispatch);
//       }
//     })
//     .catch((e) => {
//       handleServerNetworkError(e, dispatch);
//     });
// };

export type ArgUpdateTask = {
  taskId: string;
  domainModel: UpdateDomainTaskModelType;
  todolistId: string;
};

export type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};

const updateTaskTC = createAppAsyncThunk<ArgUpdateTask, ArgUpdateTask>(
  `${slice.name}/updateTask`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue, getState } = thunkAPI;
    try {
      const state = getState();
      const task = state.tasks[arg.todolistId].find((t) => t.id === arg.taskId);

      if (!task) {
        return rejectWithValue(null);
      }

      const apiModel: UpdateTaskType = {
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        title: task.title,
        status: task.status,
        ...arg.domainModel
      };

      const res = await TasksApi.updateTask(arg.todolistId, arg.taskId, apiModel);

      if (res.data.resultCode === 0) {
        return arg;
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (error) {
      handleServerNetworkError(error, dispatch);
      return rejectWithValue(null);
    }
  }
);

const deleteTaskTC = createAppAsyncThunk<{ todoListId: string, taskId: string }, { todoListId: string, taskId: string }>(
  `${slice.name}/deleteTaskTC`,
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(tasksActions.changeTaskEntityStatus({ todoListId: arg.todoListId, id: arg.taskId, status: "loading" }));
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await TasksApi.deleteTask(arg.todoListId, arg.taskId);
      if (res.data.resultCode === RESUL_CODE.SUCCESS) {
        return { todoListId: arg.todoListId, taskId: arg.taskId };
      }
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null)
    } finally {
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      dispatch(tasksActions.changeTaskEntityStatus({ todoListId: arg.todoListId, id: arg.taskId, status: "idle" }));
    }
  }
);

export const tasksReducer = slice.reducer;
export const tasksActions = slice.actions;
export const tasksThunks = { getTasksTC, createTaskTC, updateTaskTC, deleteTaskTC };