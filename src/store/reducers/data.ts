import {MapToValuesReturnType} from "@/types/common";
import {createAction} from "@reduxjs/toolkit";

interface State<T> {
    readonly data: T | undefined;
    readonly isLoading: boolean;
    readonly error?: string;
}

export function createDataReducer<T, K extends string>(key: K, startState?: () => State<T>) {
    const LOAD_START: `LOAD_${K}_START` = `LOAD_${key}_START`;
    const LOAD_FINISH: `LOAD_${K}_FINISH` = `LOAD_${key}_FINISH`;
    const LOAD_ERROR: `LOAD_${K}_ERROR` = `LOAD_${key}_ERROR`;
    const CLEAR: `CLEAR_${K}` = `CLEAR_${key}`;

    const ACTIONS = {
        LOAD_START: createAction<void, typeof LOAD_START>(LOAD_START),
        LOAD_FINISH: createAction<T, typeof LOAD_FINISH>(LOAD_FINISH),
        LOAD_ERROR: createAction<string, typeof LOAD_ERROR>(LOAD_ERROR),
        CLEAR: createAction<void, typeof CLEAR>(CLEAR),
    };


    const initialState: State<T> = {
        isLoading: false,
        data: undefined,
    };


    const reducer = (
        state = startState ? startState() : initialState,
        action: MapToValuesReturnType<typeof ACTIONS>,
    ): State<T> => {

        if (ACTIONS.LOAD_START.match(action)) {
            return { ...initialState, isLoading: true };
        }
        
        if (ACTIONS.LOAD_FINISH.match(action)) {
            return { ...initialState, data: action.payload, isLoading: false };
        }

        if (ACTIONS.LOAD_ERROR.match(action)) {
            return { ...initialState, error: action.payload };
        }

        if (ACTIONS.CLEAR.match(action)) {
            return { ...initialState, data: undefined };
        }

        return state;
    }

    return { reducer, ACTIONS };
}
