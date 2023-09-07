import axios, {AxiosResponse} from "axios";
import {LoginDataType} from "../features/Login/Login";

const instance = axios.create({
    baseURL: "https://social-network.samuraijs.com/api/1.1/",
    withCredentials: true,
    headers: {
        'API-KEY': 'afd6ff0f-b946-43ee-8cf6-ef27b7241d9b'
    }
})

export type ResponseType<D = {}> = {
    resultCode: number
    messages: Array<string>
    fieldsErrors: Array<string>
    data: D
}

export type UserType = {
    id: number
    email: string
    login: string
}

export type TodoListType = {
    addedDate: string
    id: string
    order: number
    title: string
}

type GetTasksResponse = {
    error: string | null
    totalCount: number
    items: TaskType[]
}

export type TaskType = {
    id: string
    title: string
    description: string
    todoListId: string
    order: number
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string,
    deadline: string,
    addedDate: string
}

export type UpdateTaskType = {
    title: string
    description: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
}

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}

export enum RESUL_CODE {
    SUCCESS = 0,
    FAILED = 1,
    CATCH = 10
}

export const TodoListApi = {
    getTodoLists() {
        return instance.get<TodoListType[]>("todo-lists")
    },
    createTodoList(title: string) {
        return instance.post<ResponseType<{ item: TodoListType }>, AxiosResponse<ResponseType<{
            item: TodoListType
        }>>, { title: string }>(`todo-lists`, {title})
    },
    deleteTodoList(todoId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todoId}`)
    },
    updateTodoList(todoId: string, title: string) {
        return instance.put<ResponseType, AxiosResponse<ResponseType>, {
            title: string
        }>(`todo-lists/${todoId}`, {title})
    }
}

export const TasksApi = {
    getTasks(todolistId: string) {
        return instance.get<GetTasksResponse>(`/todo-lists/${todolistId}/tasks`)
    },
    createTask(todolistId: string, title: string) {
        return instance.post<ResponseType<{ item: TaskType }>, AxiosResponse<ResponseType<{ item: TaskType }>>, {
            title: string
        }>(`/todo-lists/${todolistId}/tasks`, {title})
    },
    updateTask(todolistId: string, taskId: string, task: UpdateTaskType) {
        return instance.put<ResponseType<{ item: TaskType }>, AxiosResponse<ResponseType<{
            item: TaskType
        }>>, UpdateTaskType>(`/todo-lists/${todolistId}/tasks/${taskId}`, task)
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`/todo-lists/${todolistId}/tasks/${taskId}`)
    }
}

export const authAPI = {
    login(loginData: LoginDataType) {
        return instance.post<ResponseType<{ userId: number }>, AxiosResponse<ResponseType<{ userId: number }>>, LoginDataType>('/auth/login', loginData)
    },
    logout() {
        return instance.delete<ResponseType, AxiosResponse<ResponseType>>('/auth/login')
    },
    me() {
        return instance.get<ResponseType<UserType>, AxiosResponse<ResponseType<UserType>>>('/auth/me')
    }
}