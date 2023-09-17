import { RESUL_CODE, TasksApi, TaskStatuses, TaskType, UpdateTaskType } from "../api/api";
import { AppThunk } from "./store";
import { appActions, RequestStatusType } from "./app-reducer";
import { handleServerAppError, handleServerNetworkError } from "../utils/error-utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { todoListsActions } from "redux/todolists-reducer";

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
    setTasks: (state, action:PayloadAction<{ todoListId: string, tasks: TaskType[] }>) => {
      const tasksForCurrentTodoList = state[action.payload.todoListId]
      action.payload.tasks.forEach(t => {
        tasksForCurrentTodoList.push({...t, entityStatus: 'idle'})
      })
    },
    removeTask: (state, action: PayloadAction<{ todoListId: string, id: string }>) => {
      const tasksForCurrentTodoList = state[action.payload.todoListId];
      const index = tasksForCurrentTodoList.findIndex(t => t.id === action.payload.id)
      if (index !== -1) tasksForCurrentTodoList.splice(index, 1)
    },
    addTask: (state, action: PayloadAction<{todoListId: string, task: TaskType }>) => {
      const tasksForCurrentTodoList = state[action.payload.task.todoListId];
      const newTask: TasksDomainType = {
        ...action.payload.task,
        entityStatus: 'idle'
      }
      tasksForCurrentTodoList.unshift(newTask)
    },
    changeTaskTitle: (state, action: PayloadAction<{todoListId: string, id: string, newTitle: string}>) => {
      const tasksForCurrentTodoList = state[action.payload.todoListId]
      const index = tasksForCurrentTodoList.findIndex(t => t.id === action.payload.id)
      if(index !== -1) tasksForCurrentTodoList[index].title = action.payload.newTitle
    },
    changeTaskStatus: (state, action: PayloadAction<{ todoListId: string, id: string, status: TaskStatuses }>) => {
      const tasksForCurrentTodoList = state[action.payload.todoListId]
      const index = tasksForCurrentTodoList.findIndex(t => t.id === action.payload.id)
      if(index !== -1) tasksForCurrentTodoList[index].status = action.payload.status
    },
    changeTaskEntityStatus: (state, action: PayloadAction<{ todoListId: string, id: string, status: RequestStatusType }>) => {
      const tasksForCurrentTodoList = state[action.payload.todoListId]
      const index = tasksForCurrentTodoList.findIndex(t => t.id === action.payload.id)
      if(index !== -1) tasksForCurrentTodoList[index].entityStatus = action.payload.status
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(todoListsActions.addTodoList, (state, action) => {
        state[action.payload.todoList.id] = [];
      })
      .addCase(todoListsActions.removeTodoList, (state, action) => {
        delete state[action.payload.todoListId];
      })
      .addCase(todoListsActions.setTodoList, (state, action) => {
        action.payload.data.forEach(tl => {
          state[tl.id] = [];
        });
      });
  }
});

export const tasksReducer = slice.reducer;
export const tasksActions = slice.actions;


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


export const getTasksTC = (todoId: string): AppThunk => (dispatch) => {
  dispatch(appActions.setAppStatus({ status: "loading" }));
  TasksApi.getTasks(todoId)
    .then((res) => {
      dispatch(tasksActions.setTasks({ todoListId: todoId, tasks: res.data.items }));
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
    })
    .catch((e) => {
      handleServerNetworkError(e, dispatch);
    });
};

export const createTaskTC = (todoId: string, title: string): AppThunk => (dispatch) => {
  dispatch(appActions.setAppStatus({ status: "loading" }));
  TasksApi.createTask(todoId, title)
    .then((res) => {
      if (res.data.resultCode === RESUL_CODE.SUCCESS) {
        dispatch(tasksActions.addTask({ todoListId: todoId, task: res.data.data.item }));
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((e) => {
      handleServerNetworkError(e, dispatch);
    });
};

export const updateTaskStatusTC = (todolistId: string, taskId: string, status: TaskStatuses): AppThunk => (dispatch, getState) => {
  const task = getState().tasks[todolistId].find(t => t.id === taskId);
  if (task) {
    const model: UpdateTaskType = {
      title: task.title,
      description: task.description,
      status: status,
      priority: task.priority,
      startDate: task.startDate,
      deadline: task.deadline
    };
    dispatch(appActions.setAppStatus({ status: "loading" }));
    dispatch(tasksActions.changeTaskEntityStatus({ todoListId: todolistId, id: taskId, status: "loading"}));
    TasksApi.updateTask(todolistId, taskId, model)
      .then((res) => {
        if (res.data.resultCode === RESUL_CODE.SUCCESS) {
          dispatch(tasksActions.changeTaskStatus({ todoListId: todolistId, id: taskId, status: status }));
          dispatch(appActions.setAppStatus({ status: "succeeded" }));
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch((e) => {
        handleServerNetworkError(e, dispatch);
      })
      .finally(() => {
        dispatch(tasksActions.changeTaskEntityStatus({ todoListId: todolistId, id: taskId, status: "idle"}));
      });
  }
};
export const updateTaskTitleTC = (todolistId: string, taskId: string, title: string): AppThunk => (dispatch, getState) => {
  const task = getState().tasks[todolistId].find(t => t.id === taskId);
  if (task) {
    const model: UpdateTaskType = {
      title: title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      startDate: task.startDate,
      deadline: task.deadline
    };
    dispatch(appActions.setAppStatus({ status: "loading" }));
    dispatch(tasksActions.changeTaskEntityStatus({ todoListId: todolistId, id: taskId, status: "loading"}));
    TasksApi.updateTask(todolistId, taskId, model)
      .then((res) => {
        if (res.data.resultCode === RESUL_CODE.SUCCESS) {
          dispatch(tasksActions.changeTaskTitle({ todoListId: todolistId, id: taskId, newTitle: title }));
          dispatch(appActions.setAppStatus({ status: "succeeded" }));
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch((e) => {
        handleServerNetworkError(e, dispatch);
      })
      .finally(() => {
        dispatch(tasksActions.changeTaskEntityStatus({ todoListId: todolistId, id: taskId, status: "idle"}));
      });
  }
};
export const deleteTaskTC = (todoId: string, taskId: string): AppThunk => (dispatch) => {
  dispatch(tasksActions.changeTaskEntityStatus({ todoListId: todoId, id: taskId, status: "loading"}));
  dispatch(appActions.setAppStatus({ status: "loading" }));
  TasksApi.deleteTask(todoId, taskId)
    .then((res) => {
      if (res.data.resultCode === RESUL_CODE.SUCCESS) {
        dispatch(tasksActions.removeTask({ todoListId: todoId, id: taskId }));
        dispatch(appActions.setAppStatus({ status: "succeeded" }));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((e) => {
      handleServerNetworkError(e, dispatch);
    })
    .finally(() => {
      dispatch(tasksActions.changeTaskEntityStatus({ todoListId: todoId, id: taskId, status: "idle"}));
    });
};