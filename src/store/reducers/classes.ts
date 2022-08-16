import {Class} from "@/types/models";
import {createDataReducer} from "./data";

export const {
    ACTIONS: CLASSES_ACTIONS,
    reducer: classesReducer
} = createDataReducer<ReadonlyArray<Class>, "classes">("classes");
