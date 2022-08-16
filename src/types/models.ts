export type IDStr = string;

export interface User {
    readonly id: string;
    readonly name: string;
    readonly classIDs: ReadonlyArray<IDStr>;
}

export interface Class {
    readonly id: string;
    readonly name: string;
    readonly students: ReadonlyArray<Omit<User, "classIDs">>;
}
