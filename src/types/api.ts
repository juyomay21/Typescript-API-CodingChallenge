import {IDStr} from "./models";

export interface AirTableResponse<T = unknown> {
    readonly records: ReadonlyArray<T>;
}

export interface AirTableDataRecord<T = unknown> {
    readonly id: string;
    readonly createdTime: string;
    readonly fields: T;
}

export interface AirTableStudentFields {
    readonly Name: string;
    readonly Classes: ReadonlyArray<IDStr>;
}

export interface AirTableClassFields {
    readonly Name: string;
    readonly Students: ReadonlyArray<IDStr>;
}

export type GetClassesResponseData = AirTableResponse<AirTableDataRecord<AirTableClassFields>>;
export type GetStudentsResponseData = AirTableResponse<AirTableDataRecord<AirTableStudentFields>>;
