import { AxiosResponse } from "axios";
import { instance, ResponseType } from "common/api/api";

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


export type TodoListType = {
  addedDate: string
  id: string
  order: number
  title: string
}

