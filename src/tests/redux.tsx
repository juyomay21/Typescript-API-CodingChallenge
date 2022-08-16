import {configureStore, Store} from "@reduxjs/toolkit";
import {rootReducer} from "@/store/reducers/index";
import {Provider} from "react-redux";

export const createMockStore = (initialState?: Partial<ReturnType<typeof rootReducer>>) => {
    return configureStore({ reducer: rootReducer, preloadedState: initialState });
};

interface IStoreWrapper {
    readonly children: React.ReactNode;
}

export const getStoreWrapper = <T,>(store: Store<T>): React.FC<IStoreWrapper> => {
    return (props) => <Provider {...props} store={store} />;
};
