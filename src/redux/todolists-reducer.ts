import {TodoListApi, TodoListType} from "../api/api";
import {Dispatch} from "redux";

export type RemoveTodoListAT = {
    type: "REMOVE-TODOLIST"
    todoListId: string
}

export type AddTodoListsAT = {
    type: "ADD-TODOLIST"
    todoListId: TodoListType
}

export type ChangeTodoListTitleAT = {
    type: "CHANGE-TODOLIST-TITLE"
    newTitle: string
    todoListId: string
}

export type ChangeTodoListFilterAT = {
    type: "CHANGE-TODOLIST-FILTER"
    nextFilterValue: FilterValuesType
    todoListId: string
}

export type SetTodoListAT = {
    type: "SET-TODOLIST"
    data: TodoListType[]
}

export type todoListsReducerAT = RemoveTodoListAT | AddTodoListsAT | ChangeTodoListTitleAT | ChangeTodoListFilterAT | SetTodoListAT

export type FilterValuesType = "all" | "active" | "completed"
export type TodoListDomainType = TodoListType & {
    filter: FilterValuesType
}

const initialState: Array<TodoListDomainType> = []

export const todoListsReducer = (state: Array<TodoListDomainType> = initialState, action: todoListsReducerAT): Array<TodoListDomainType> => {
    switch (action.type) {
        case "SET-TODOLIST":
            return action.data.map(t => ({...t, filter: 'all'}))
        case "ADD-TODOLIST":
            const newTodolist: TodoListDomainType = {
                ...action.todoListId,
                filter: "all",
            }
            return [newTodolist, ...state]
        case "CHANGE-TODOLIST-TITLE":
            return state
                .map(tl => tl.id === action.todoListId ? {...tl, title: action.newTitle} : tl)
        case "CHANGE-TODOLIST-FILTER":
            return state
                .map(tl => tl.id === action.todoListId ? {...tl, filter: action.nextFilterValue} : tl)
        case "REMOVE-TODOLIST":
            return state.filter(tl => tl.id !== action.todoListId)
        default:
            return state
    }
}

export const removeTodoListAC = (todoListId: string): RemoveTodoListAT => (
    {type: "REMOVE-TODOLIST", todoListId: todoListId }
)
export const addTodoListsAC = (todoListId: TodoListType): AddTodoListsAT => (
    {type: "ADD-TODOLIST", todoListId }
)
export const changeTodoListTitleAC = (todoListId: string, newTitle: string): ChangeTodoListTitleAT => (
    {type: "CHANGE-TODOLIST-TITLE", newTitle: newTitle, todoListId: todoListId}
)
export const changeTodoListFilterAC = (nextFilterValue: FilterValuesType, todoListId: string): ChangeTodoListFilterAT => (
    {type: "CHANGE-TODOLIST-FILTER", nextFilterValue: nextFilterValue, todoListId: todoListId}
)
export const setTodoListAC = (data: TodoListType[]) => (
    {type: "SET-TODOLIST", data}
)

export const getTodosTC = () => (dispatch: Dispatch) => {
    TodoListApi.getTodoList()
        .then((res) => {
            dispatch(setTodoListAC(res.data))
        })
}
export const createTodoTC = (title: string) => (dispatch: Dispatch) => {
    TodoListApi.createTodoList(title)
        .then((res) => {
            dispatch(addTodoListsAC(res.data.data.item))
        })
}
export const updateTodoTC = (todoId: string, newTitle: string) => (dispatch: Dispatch) => {
    TodoListApi.updateTodoList(todoId, newTitle)
        .then((res) => {
            res.data
            dispatch(changeTodoListTitleAC(todoId, newTitle))
        })
}
export const removeTodoTC = (todoId: string) => (dispatch: Dispatch) => {
    TodoListApi.deleteTodoList(todoId)
        .then((res) => {
            res.data
            dispatch(removeTodoListAC(todoId))
        })
}