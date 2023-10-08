import { LoginDataType } from "features/Login/ui/Login";
import { AxiosResponse } from "axios";
import { instance, ResponseType } from "common/api/api";

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

export type UserType = {
  id: number
  email: string
  login: string
}