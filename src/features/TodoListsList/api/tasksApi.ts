import { instance, ResponseType, TaskPriorities, TaskStatuses } from "common/api/api";
import { AxiosResponse } from "axios";

export const TasksApi = {
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(`/todo-lists/${todolistId}/tasks`);
  },
  createTask(todolistId: string, title: string) {
    return instance.post<ResponseType<{ item: TaskType }>, AxiosResponse<ResponseType<{ item: TaskType }>>, {
      title: string
    }>(`/todo-lists/${todolistId}/tasks`, { title });
  },
  updateTask(todolistId: string, taskId: string, task: UpdateTaskType) {
    return instance.put<ResponseType<{ item: TaskType }>, AxiosResponse<ResponseType<{
      item: TaskType
    }>>, UpdateTaskType>(`/todo-lists/${todolistId}/tasks/${taskId}`, task);
  },
  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<ResponseType>(`/todo-lists/${todolistId}/tasks/${taskId}`);
  }
};
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