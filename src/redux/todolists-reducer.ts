import {RESUL_CODE, TodoListApi, TodoListType} from "../api/api";
import {Dispatch} from "redux";
import {RequestStatusType, setAppStatusAC, SetAppStatusAT} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";

export type FilterValuesType = "all" | "active" | "completed"
export type TodoListDomainType = TodoListType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

const initialState: Array<TodoListDomainType> = []

export const todoListsReducer = (state: Array<TodoListDomainType> = initialState, action: todoListsReducerAT): Array<TodoListDomainType> => {
    switch (action.type) {
        case "SET-TODOLIST":
            return action.data.map(t => ({...t, filter: 'all', entityStatus: "idle"}))
        case "ADD-TODOLIST":
            const newTodolist: TodoListDomainType = {
                ...action.todoListId,
                filter: "all",
                entityStatus: "idle"
            }
            return [newTodolist, ...state]
        case "CHANGE-TODOLIST-TITLE":
            return state.map(tl => tl.id === action.todoListId ? {...tl, title: action.newTitle} : tl)
        case "CHANGE-TODOLIST-FILTER":
            return state.map(tl => tl.id === action.todoListId ? {...tl, filter: action.nextFilterValue} : tl)
        case "CHANGE-TODOLIST-STATUS":
            return state.map(tl => tl.id === action.todoListId ? {...tl, entityStatus: action.status} : tl)
        case "REMOVE-TODOLIST":
            return state.filter(tl => tl.id !== action.todoListId)
        default:
            return state
    }
}

export type RemoveTodoListAT = ReturnType<typeof removeTodoListAC>
export type AddTodoListsAT = ReturnType<typeof addTodoListAC>
export type SetTodoListAT = ReturnType<typeof setTodoListAC>

export type todoListsReducerAT =
    | RemoveTodoListAT | AddTodoListsAT | SetTodoListAT | SetAppStatusAT
    | ReturnType<typeof changeTodoListTitleAC>
    | ReturnType<typeof changeTodoListFilterAC>
    | ReturnType<typeof changeTodoListStatusAC>


export const removeTodoListAC = (todoListId: string) => (
    {type: "REMOVE-TODOLIST", todoListId: todoListId} as const
)
export const addTodoListAC = (todoListId: TodoListType) => (
    {type: "ADD-TODOLIST", todoListId} as const
)
export const changeTodoListTitleAC = (todoListId: string, newTitle: string) => (
    {type: "CHANGE-TODOLIST-TITLE", newTitle, todoListId} as const
)
export const changeTodoListFilterAC = (nextFilterValue: FilterValuesType, todoListId: string) => (
    {type: "CHANGE-TODOLIST-FILTER", nextFilterValue, todoListId} as const
)
export const changeTodoListStatusAC = (status: RequestStatusType, todoListId: string) => (
    {type: "CHANGE-TODOLIST-STATUS", status, todoListId} as const
)
export const setTodoListAC = (data: TodoListType[]) => (
    {type: "SET-TODOLIST", data} as const
)


export const getTodosTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    TodoListApi.getTodoLists()
        .then((res) => {
            dispatch(setTodoListAC(res.data))
            dispatch(setAppStatusAC('succeeded'))
        })
        .catch((e) => {
            handleServerNetworkError(e, dispatch)
        })
}
export const createTodoTC = (title: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    TodoListApi.createTodoList(title)
        .then((res) => {
            if (res.data.resultCode === RESUL_CODE.SUCCESS) {
                dispatch(addTodoListAC(res.data.data.item))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((e) => {
            handleServerNetworkError(e, dispatch)
        })
}
export const updateTodoTC = (todoId: string, newTitle: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTodoListStatusAC('loading', todoId))
    TodoListApi.updateTodoList(todoId, newTitle)
        .then((res) => {
            if (res.data.resultCode === RESUL_CODE.SUCCESS) {
                dispatch(changeTodoListTitleAC(todoId, newTitle))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((e) => {
            handleServerNetworkError(e, dispatch)
        })
        .finally(() => {
            dispatch(changeTodoListStatusAC('idle', todoId))
        })
}
export const removeTodoTC = (todoId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTodoListStatusAC('loading', todoId))
    TodoListApi.deleteTodoList(todoId)
        .then((res) => {
            if (res.data.resultCode === RESUL_CODE.SUCCESS) {
                dispatch(removeTodoListAC(todoId))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data, dispatch)
                dispatch(changeTodoListStatusAC('idle', todoId))
            }
        })
        .catch((e) => {
            handleServerNetworkError(e, dispatch)
            dispatch(changeTodoListStatusAC('idle', todoId))
        })
}