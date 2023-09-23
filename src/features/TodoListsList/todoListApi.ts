import { AxiosResponse } from "axios";
import {
  instance,
  ResponseType,
  TaskPriorities,
  TaskStatuses,
} from "common/api/api";

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