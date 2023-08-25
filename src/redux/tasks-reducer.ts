import {TaskStateType} from "../AppWithRedux";
import {AddTodoListsAT, RemoveTodoListAT, SetTodoListAT} from "./todolists-reducer";
import {TasksApi, TaskStatuses, TaskType, UpdateTaskType} from "../api/api";
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";

export type RemoveTasksAT = {
    type: "REMOVE-TASKS"
    todoListId: string
    id: string
}

export type AddTasksAT = {
    type: "ADD-TASKS"
    task: TaskType
    todoListId: string
}

export type ChangeTasksTitleAT = {
    type: "CHANGE-TASKS-TITLE"
    newTitle: string
    todoListId: string
    id: string
}

export type ChangeTasksStatusAT = {
    type: "CHANGE-TASKS-STATUS"
    todoListId: string
    status: TaskStatuses
    id: string
}

export type SetTasksAt = ReturnType<typeof setTasksAc>

export type tasksReducerAT = RemoveTasksAT | AddTasksAT
    | ChangeTasksTitleAT | ChangeTasksStatusAT | RemoveTodoListAT | AddTodoListsAT | SetTodoListAT | SetTasksAt

const initialState:TaskStateType = {}

export const tasksReducer = (state: TaskStateType = initialState, action: tasksReducerAT): TaskStateType => {
    switch (action.type) {
        case "SET-TODOLIST":
            const copyState = {...state}
            action.data.forEach((t) => {
                copyState[t.id] = []
            })
            return copyState
        case "SET-TASKS":
            return {...state,
                [action.todoId]: action.tasks
            }
        case "REMOVE-TASKS":
            return {...state, [action.todoListId]: state[action.todoListId].filter(t=> t.id !== action.id)}
        case "ADD-TASKS":
            return {...state, [action.todoListId]: [action.task, ...state[action.todoListId]]}
        case "CHANGE-TASKS-STATUS":
            return {...state, [action.todoListId]: state[action.todoListId]
                    .map(t => t.id === action.id ? {...t, status: action.status} : t)}
        case "CHANGE-TASKS-TITLE":
            return {...state, [action.todoListId]: state[action.todoListId]
                    .map(t => t.id === action.id ? {...t, title: action.newTitle} : t)}
        case "ADD-TODOLIST":
            return {...state, [action.todoListId.id]: []}
        case "REMOVE-TODOLIST":
            // let {[action.todoListId]: [], ...rest} = state
            // return rest
            let stateCopy = {...state}
            delete stateCopy[action.todoListId]
            return stateCopy
        default:
            return state
    }
}

export const removeTaskAC = (todoListId: string, id: string): RemoveTasksAT => (
    {type: "REMOVE-TASKS", todoListId: todoListId, id: id }
)
export const addTaskAC = (task: TaskType, todoListId: string): AddTasksAT => (
    {type: "ADD-TASKS", task, todoListId}
)
export const changeTaskTitleAC = (newTitle: string, todoListId: string, id: string): ChangeTasksTitleAT => (
    {type: "CHANGE-TASKS-TITLE", newTitle: newTitle, todoListId: todoListId, id}
)
export const changeTaskStatusAC = (status: TaskStatuses, todoListId: string, id: string): ChangeTasksStatusAT => (
    {type: "CHANGE-TASKS-STATUS", status, todoListId, id}
)
export const setTasksAc = (tasks: TaskType[], todoId: string) => (
    {type: "SET-TASKS", todoId, tasks} as const
)


export const getTasksTC = (todoId: string) => (dispatch: Dispatch) => {
    TasksApi.getTasks(todoId)
        .then((res) => {
            dispatch(setTasksAc(res.data.items, todoId))
        })
}
export const createTaskTC = (todoId: string, title: string) => (dispatch: Dispatch) => {
    TasksApi.createTask(todoId, title)
        .then((res) => {
            dispatch(addTaskAC(res.data.data.item, todoId))
        })
}
export const updateTaskStatusTC = (todolistId: string, taskId: string, status: TaskStatuses) => (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const task = getState().tasks[todolistId].find(t => t.id === taskId)
    debugger
    if (task) {
        const model: UpdateTaskType = {
            title: task.title,
            description: task.description,
            status: status,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline
        }
        TasksApi.updateTask(todolistId, taskId, model)
            .then((res) => {
                res.data
                dispatch(changeTaskStatusAC(status, todolistId, taskId))
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
        TasksApi.updateTask(todolistId, taskId, model)
            .then((res) => {
                res.data
                dispatch(changeTaskTitleAC(title, todolistId, taskId))
            })
    }
}
export const deleteTaskTC = (todoId: string, taskId: string) => (dispatch: Dispatch) => {
    TasksApi.deleteTask(todoId, taskId)
        .then((res) => {
            res.data
            dispatch(removeTaskAC(todoId, taskId))
    })
}