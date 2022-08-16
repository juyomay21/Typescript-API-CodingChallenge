export type MapToValuesReturnType<T extends Record<string, (...x: any[]) => any>> = ReturnType<T[keyof T]>;
