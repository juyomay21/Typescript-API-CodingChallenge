import {getClassesByIDs, getStudentsByIDs} from "@/api";
import {Class, IDStr, User} from "@/types/models";
import {Dispatch} from "redux";
import {CLASSES_ACTIONS} from "../reducers/classes";
import {abortable} from "./helpers";

const ERROR_MESSAGE = "Something happened while fetching classes. Please try again later";

export const fetchClasses = (classIDs: ReadonlyArray<IDStr>) =>
    abortable(async (abortSignal: AbortSignal, dispatch: Dispatch) => {
        dispatch(CLASSES_ACTIONS.LOAD_START());

        try {

            const classesData = await getClassesByIDs(classIDs, abortSignal);

            // Use a set to remove duplicates
            const studentIDs = Array.from(new Set(classesData.records.flatMap(record => record.fields.Students)));
            const studentsData = await getStudentsByIDs(studentIDs);

            const studentEntries: ReadonlyArray<[IDStr, Omit<User, "classIDs">]> = studentsData.records.map(student => [
                student.id,
                {
                    id: student.id,
                    name: student.fields.Name,
                }
            ]);

            const studentsMap = new Map(studentEntries);

            const classes: ReadonlyArray<Class> = classesData.records.map(item => ({
                id: item.id,
                name: item.fields.Name,
                students: item.fields.Students.map(id => studentsMap.get(id)!)
            }));

            dispatch(CLASSES_ACTIONS.LOAD_FINISH(classes));

        } catch (e: any) {
            if (e.name === "AbortError") {
                return;
            }

            console.error(e);
            dispatch(CLASSES_ACTIONS.LOAD_ERROR(ERROR_MESSAGE));
        }
    });
