import { AppRootStateType } from "redux/store";


export const isLoadingSelector = (state: AppRootStateType) => state.auth.isLoggedIn