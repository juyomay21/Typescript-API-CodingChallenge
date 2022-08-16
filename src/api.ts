import {GetClassesResponseData, GetStudentsResponseData} from "./types/api";
import {IDStr} from "./types/models";

// I'm not sure whether moving this into an environment variable is a requirement here
export const AIRTABLE_API_KEY = "keyvhCV62PWtzK0wa";


export const GET_STUDENTS = "https://api.airtable.com/v0/app8ZbcPx7dkpOnP0/Students";
export const GET_CLASSES = "https://api.airtable.com/v0/app8ZbcPx7dkpOnP0/Classes";

export const didSucceed = (resp: Response) => resp.status >= 200 && resp.status < 300;

class FetchError extends Error {
    readonly response: Response;

    constructor(response: Response) {
        super(response.statusText);
        this.response = response;
    }
}


/**
 * Create an `in array` polyfill that allows us to fetch multiple records by ID
 */
const createIDInQuery = (ids: ReadonlyArray<string>): string => `
    OR(${ids.map(id => `RECORD_ID() = "${id}"`).join(",")})
`;

export const getClassesByIDs = async (ids: ReadonlyArray<IDStr>, abortSignal?: AbortSignal): Promise<GetClassesResponseData> => {
    const url = new URL(GET_CLASSES);
    url.searchParams.set("api_key", AIRTABLE_API_KEY);
    url.searchParams.set("filterByFormula", createIDInQuery(ids));

    const resp = await fetch(url.toString(), {
        headers: { Accept: "application/json" },
        signal: abortSignal,
    });

    if (! didSucceed(resp)) {
        throw new FetchError(resp);
    }

    return await resp.json();
};

export const getStudentsByIDs = async (ids: ReadonlyArray<IDStr>, abortSignal?: AbortSignal): Promise<GetStudentsResponseData> => {
    const url = new URL(GET_STUDENTS);
    url.searchParams.set("api_key", AIRTABLE_API_KEY);
    url.searchParams.set("filterByFormula", createIDInQuery(ids));


    const resp = await fetch(url.toString(), {
        headers: { Accept: "application/json" },
        signal: abortSignal,
    });

    if (! didSucceed(resp)) {
        throw new FetchError(resp);
    }

    return await resp.json();
};

export const getUsersByName = async (name: string, abortSignal?: AbortSignal): Promise<GetStudentsResponseData> => {
    const url = new URL(GET_STUDENTS);
    url.searchParams.set("api_key", AIRTABLE_API_KEY);
    url.searchParams.set("filterByFormula", `Name="${name}"`);

    const resp = await fetch(url.toString(), {
        headers: { Accept: "application/json" },
        signal: abortSignal,
    });

    if (! didSucceed(resp)) {
        throw new FetchError(resp);
    }

    return await resp.json();
};
