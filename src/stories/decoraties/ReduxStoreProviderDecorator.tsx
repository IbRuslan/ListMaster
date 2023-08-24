import React from 'react'
import {store} from "../../redux/store";
import {Provider} from "react-redux";

export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
    return <Provider store={store}>{storyFn()}</Provider>
}