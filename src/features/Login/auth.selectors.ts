import { AppRootStateType } from "app/store";


export const isLoadingSelector = (state: AppRootStateType) => state.auth.isLoggedIn