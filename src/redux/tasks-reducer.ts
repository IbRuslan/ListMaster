import {AddTodoListsAT, clearTodoListsDataAT, RemoveTodoListAT, SetTodoListAT} from "./todolists-reducer";
import {RESUL_CODE, TasksApi, TaskStatuses, TaskType, UpdateTaskType} from "../api/api";
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";
import {RequestStatusType, setAppStatusAC} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";

export type TaskStateType = {
    [id: string]: Array<TasksDomainType>
}

export type TasksDomainType = TaskType & {
    entityStatus: RequestStatusType
}

const initialState: TaskStateType = {}

export const tasksReducer = (state: TaskStateType = initialState, action: tasksReducerAT): TaskStateType => {
    switch (action.type) {
        case "SET-TODOLIST":
            const copyState = {...state}
            action.data.forEach((t) => {
                copyState[t.id] = []
            })
            return copyState
        case "SET-TASKS":
            return {
                ...state,
                [action.todoId]: action.tasks.map((t) => ({...t, entityStatus: 'idle'}))
            }
        case "REMOVE-TASKS":
            return {...state, [action.todoListId]: state[action.todoListId].filter(t => t.id !== action.id)}
        case "ADD-TASKS":
            const newTask: TasksDomainType = {
                ...action.task,
                entityStatus: 'idle'
            }
            return {...state, [action.todoListId]: [newTask, ...state[action.todoListId]]}
        case "CHANGE-TASKS-STATUS":
            return {...state, [action.todoListId]: state[action.todoListId]
                    .map(t => t.id === action.id ? {...t, status: action.status} : t)
            }
        case "CHANGE-TASKS-TITLE":
            return {...state, [action.todoListId]: state[action.todoListId]
                    .map(t => t.id === action.id ? {...t, title: action.newTitle} : t)
            }
        case "CHANGE-TASKS-ENTITY-STATUS":
            return {...state, [action.todoListId]: state[action.todoListId]
                    .map(t => t.id === action.id ? {...t, entityStatus: action.status} : t)
            }
        case "ADD-TODOLIST":
            return {...state, [action.todoListId.id]: []}
        case "REMOVE-TODOLIST":
            // let {[action.todoListId]: [], ...rest} = state
            // return rest
            let stateCopy = {...state}
            delete stateCopy[action.todoListId]
            return stateCopy
        case "CLEAR-DATA":
            return {}
        default:
            return state
    }
}

export type RemoveTasksAT = ReturnType<typeof removeTaskAC>

export type AddTasksAT = ReturnType<typeof addTaskAC>

export type ChangeTasksTitleAT = ReturnType<typeof changeTaskTitleAC>

export type ChangeTasksStatusAT = ReturnType<typeof changeTaskStatusAC>

export type changeTaskEntityStatusAT = ReturnType<typeof changeTaskEntityStatusAC>

export type SetTasksAt = ReturnType<typeof setTasksAC>

export type tasksReducerAT =
    | RemoveTasksAT | AddTasksAT
    | ChangeTasksTitleAT | ChangeTasksStatusAT
    | RemoveTodoListAT | AddTodoListsAT | SetTodoListAT
    | SetTasksAt | changeTaskEntityStatusAT | clearTodoListsDataAT

export const removeTaskAC = (todoListId: string, id: string) => (
    {type: "REMOVE-TASKS", todoListId: todoListId, id: id} as const
)
export const addTaskAC = (task: TaskType, todoListId: string) => (
    {type: "ADD-TASKS", task, todoListId} as const
)
export const changeTaskTitleAC = (newTitle: string, todoListId: string, id: string) => (
    {type: "CHANGE-TASKS-TITLE", newTitle: newTitle, todoListId: todoListId, id} as const
)
export const changeTaskStatusAC = (status: TaskStatuses, todoListId: string, id: string) => (
    {type: "CHANGE-TASKS-STATUS", status, todoListId, id} as const
)
export const changeTaskEntityStatusAC = (status: RequestStatusType, todoListId: string, id: string) => (
    {type: "CHANGE-TASKS-ENTITY-STATUS", status, todoListId, id} as const
)
export const setTasksAC = (tasks: TaskType[], todoId: string) => (
    {type: "SET-TASKS", todoId, tasks} as const
)


export const getTasksTC = (todoId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    TasksApi.getTasks(todoId)
        .then((res) => {
            dispatch(setTasksAC(res.data.items, todoId))
            dispatch(setAppStatusAC('succeeded'))
        })
        .catch((e) => {
            handleServerNetworkError(e, dispatch)
        })
}

export const createTaskTC = (todoId: string, title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    TasksApi.createTask(todoId, title)
        .then((res) => {
            if (res.data.resultCode === RESUL_CODE.SUCCESS) {
                dispatch(addTaskAC(res.data.data.item, todoId))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((e) => {
            handleServerNetworkError(e, dispatch)
        })
}

export const updateTaskStatusTC = (todolistId: string, taskId: string, status: TaskStatuses) => (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const task = getState().tasks[todolistId].find(t => t.id === taskId)
    if (task) {
        const model: UpdateTaskType = {
            title: task.title,
            description: task.description,
            status: status,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline
        }
        dispatch(setAppStatusAC('loading'))
        dispatch(changeTaskEntityStatusAC('loading', todolistId, taskId))
        TasksApi.updateTask(todolistId, taskId, model)
            .then((res) => {
                if (res.data.resultCode === RESUL_CODE.SUCCESS) {
                    dispatch(changeTaskStatusAC(status, todolistId, taskId))
                    dispatch(setAppStatusAC('succeeded'))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch((e) => {
                handleServerNetworkError(e, dispatch)
            })
            .finally(()=> {
                dispatch(changeTaskEntityStatusAC('idle', todolistId, taskId))
            })
    }
}
export const updateTaskTitleTC = (todolistId: string, taskId: string, title: string) => (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const task = getState().tasks[todolistId].find(t => t.id === taskId)
    if (task) {
        const model: UpdateTaskType = {
            title: title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline
        }
        dispatch(setAppStatusAC('loading'))
        dispatch(changeTaskEntityStatusAC('loading', todolistId, taskId))
        TasksApi.updateTask(todolistId, taskId, model)
            .then((res) => {
                if (res.data.resultCode === RESUL_CODE.SUCCESS) {
                dispatch(changeTaskTitleAC(title, todolistId, taskId))
                dispatch(setAppStatusAC('succeeded'))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch((e)=> {
                handleServerNetworkError(e, dispatch)
            })
            .finally(()=>{
                dispatch(changeTaskEntityStatusAC('idle', todolistId, taskId))
            })
    }
}
export const deleteTaskTC = (todoId: string, taskId: string) => (dispatch: Dispatch) => {
    dispatch(changeTaskEntityStatusAC('loading', todoId, taskId))
    dispatch(setAppStatusAC('loading'))
    TasksApi.deleteTask(todoId, taskId)
        .then((res) => {
            if (res.data.resultCode === RESUL_CODE.SUCCESS) {
                dispatch(removeTaskAC(todoId, taskId))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((e) => {
            handleServerNetworkError(e, dispatch)
        })
        .finally(()=> {
            dispatch(changeTaskEntityStatusAC('idle', todoId, taskId))
        })
}