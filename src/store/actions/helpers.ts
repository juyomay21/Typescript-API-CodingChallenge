import {Dispatch} from "redux";

export const abortable = (fn: (abortSignal: AbortSignal, dispatch: Dispatch) => Promise<void>) => {
    const abortController = new AbortController();

    const dispatcher = (dispatch: Dispatch) => fn(abortController.signal, dispatch);
    const abort = () => abortController.abort();

    return {
        dispatcher,
        abort,
    };
};
