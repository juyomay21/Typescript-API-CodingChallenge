import {getUsersByName} from "@/api";
import {Dispatch} from "redux";
import {USER_ACTIONS} from "../reducers/user";
import {abortable} from "./helpers";

const ERROR_MESSAGE = "Failed to fetch data, please try again later";

export const fetchUser = (name: string) => abortable(async (signal: AbortSignal, dispatch: Dispatch) => {
    dispatch(USER_ACTIONS.LOAD_START());

    try {

        const usersData = await getUsersByName(name, signal);

        // User was not found
        if (usersData.records.length === 0) {
            dispatch(USER_ACTIONS.LOAD_ERROR(`User ${name} was not found`));
            return;
        }

        const user = usersData.records[0];
        dispatch(USER_ACTIONS.LOAD_FINISH({
            id: user.id,
            name: user.fields.Name,
            classIDs: user.fields.Classes
        }));
    } catch (e: any) {
        if (e.name === "AbortError") {
            return;
        }

        console.error(e);
        dispatch(USER_ACTIONS.LOAD_ERROR(ERROR_MESSAGE));
    }
});
