import {combineReducers} from "redux";
import {classesReducer} from "./classes";
import {userReducer} from "./user";

export const rootReducer = combineReducers({
    user: userReducer,
    classes: classesReducer,
});
