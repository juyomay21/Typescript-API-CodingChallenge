import {User} from "@/types/models";
import {createDataReducer} from "./data";

export const {
    ACTIONS: USER_ACTIONS,
    reducer: userReducer
} = createDataReducer<User, "user">("user", () => {

    const existingUser = window.localStorage.getItem("user");

    let user: User | undefined;

    try {
        if (existingUser) {
            user = JSON.parse(existingUser);
        }
    } catch (e) {
        console.error(e);
    }

    return {
        data: user,
        isLoading: false,
    };

});
