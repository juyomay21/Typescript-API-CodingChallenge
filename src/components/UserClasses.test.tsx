import {mockConsole, restoreConsole} from "@/tests/console";
import {mockAirtableClass, mockStudent} from "@/tests/data";
import {mockAbortController, mockFetch, restoreAbortController} from "@/tests/fetch";
import {createMockStore, getStoreWrapper} from "@/tests/redux";
import {GetClassesResponseData, GetStudentsResponseData} from "@/types/api";
import faker from "@faker-js/faker";
import {render, screen, waitFor, waitForElementToBeRemoved} from "@testing-library/react";
import {UserClasses} from "./UserClasses";

describe("UserClasses", () => {
    let store: ReturnType<typeof createMockStore>;
    let classesData: GetClassesResponseData;
    let studentsData: GetStudentsResponseData;

    beforeEach(() => {
        const loggedInUser = mockStudent();

        store = createMockStore({ user: { data: loggedInUser, isLoading: false } });
        classesData = {
            records: Array
                .from({ length: faker.datatype.number({ min: 1, max: 5 }) })
                .map(() => mockAirtableClass([loggedInUser.id])),
        };

        studentsData = {
            records: [{
                id: loggedInUser.id,
                createdTime: faker.date.past().toISOString(),
                fields: {
                    Name: loggedInUser.name,
                    Classes: classesData.records.map(({ id }) => id),
                },
            }]
        };
    });

    it("Should fetch & display all the classes of a specific user", async () => {
        const classesFetchTrigger = mockFetch(classesData, undefined, { manual: true });

        render(<UserClasses />, { wrapper: getStoreWrapper(store) });

        expect(screen.getByTestId("screen-loader")).toBeInTheDocument();
        expect(screen.queryByTestId("screen-error")).toBeNull();

        classesFetchTrigger.resolve();
        mockFetch(studentsData);

        await waitForElementToBeRemoved(screen.queryByTestId("screen-loader"));

        for (const item of classesData.records) {
            expect(screen.getByText(item.fields.Name)).toBeInTheDocument();
        }
    });

    it("Should show an error when something goes wrong (classes request 1st)", async () => {
        mockConsole();
        const fetchTrigger = mockFetch(classesData, { status: 500 }, { manual: true });

        render(<UserClasses />, { wrapper: getStoreWrapper(store) });
        expect(screen.getByTestId("screen-loader")).toBeInTheDocument();

        fetchTrigger.resolve();

        await waitForElementToBeRemoved(screen.queryByTestId("screen-loader"));
        expect(screen.getByTestId("screen-error")).toBeInTheDocument();
        restoreConsole();
    });

    it("Should show an error when something goes wrong (classes request 2nd)", async () => {
        mockConsole();

        const classesFetchTrigger = mockFetch(classesData, { status: 200 }, { manual: true });

        render(<UserClasses />, { wrapper: getStoreWrapper(store) });

        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
        const studentsFetchTrigger = mockFetch(studentsData, { status: 500 }, { manual: true });

        classesFetchTrigger.resolve();

        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
        studentsFetchTrigger.resolve();

        await waitForElementToBeRemoved(screen.queryByTestId("screen-loader"));
        expect(screen.getByTestId("screen-error")).toBeInTheDocument();

        restoreConsole();
    });

    it("Should not show request anything when rendered with no logged in user", () => {
        mockFetch(null);

        const store = createMockStore();
        render(<UserClasses />, { wrapper: getStoreWrapper(store) });


        expect(screen.queryByTestId("screen-loader")).toBeNull();
        expect(screen.queryByTestId("screen-error")).toBeNull();

        expect(global.fetch).not.toHaveBeenCalled();
    });

    it("Should abort in-progress requests when the component unmounts", async () => {
        const abortControllerInstance = mockAbortController();

        mockFetch(null, undefined, { timeout: Infinity });

        const utils = render(<UserClasses />, { wrapper: getStoreWrapper(store) });

        utils.unmount();

        expect(abortControllerInstance.signal.aborted).toEqual(true);

        restoreAbortController();
    });
});
