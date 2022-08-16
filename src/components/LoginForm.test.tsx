import {AIRTABLE_API_KEY, GET_STUDENTS} from "@/api";
import {mockConsole, restoreConsole} from "@/tests/console";
import {mockAirtableStudent} from "@/tests/data";
import {mockAbortController, mockFetch, restoreAbortController} from "@/tests/fetch";
import {createMockStore, getStoreWrapper} from "@/tests/redux";
import {GetStudentsResponseData} from "@/types/api";
import faker from "@faker-js/faker";
import {fireEvent, render, screen, waitFor, waitForElementToBeRemoved} from "@testing-library/react";
import {LoginForm} from "./LoginForm";

describe("LoginForm", () => {
    let store: ReturnType<typeof createMockStore>;
    let userData: GetStudentsResponseData;

    beforeEach(() => {
        store = createMockStore();
        userData = { records: [mockAirtableStudent()] };
    });

    it("Should login users properly", async () => {
        const fetchTrigger = mockFetch(userData, undefined, { manual: true });
        render(<LoginForm />, { wrapper: getStoreWrapper(store) });
        const name = faker.name.findName();

        fireEvent.change(screen.getByLabelText("student-name-input"), { target: { value: name } });
        fireEvent.click(screen.getByRole("button"));

        expect(screen.getByTestId("screen-loader")).toBeInTheDocument();
        expect(screen.queryByTestId("screen-error")).toBeNull();
        expect(screen.getByRole("button")).toBeDisabled();

        fetchTrigger.resolve();

        await waitForElementToBeRemoved(screen.queryByTestId("screen-loader"));

        expect(screen.queryByTestId("screen-error")).toBeNull();

        const expectedURL = new URL(GET_STUDENTS);
        expectedURL.searchParams.set("api_key", AIRTABLE_API_KEY);
        expectedURL.searchParams.set("filterByFormula", `Name="${name}"`);
        expect(global.fetch).toHaveBeenCalledWith(expectedURL.toString(), expect.anything());
    });

    it("Should show an error when a user is not found", async () => {
        mockFetch<GetStudentsResponseData>({ records: [] });
        render(<LoginForm />, { wrapper: getStoreWrapper(store) });

        fireEvent.change(screen.getByLabelText("student-name-input"), { target: { value: "test" } });
        fireEvent.click(screen.getByRole("button"));
        
        await waitFor(() => {
            expect(screen.getByTestId("screen-error")).toBeInTheDocument();
        });
    });

    it("Should show an error when a server error occurs", async () => {
        mockConsole();

        mockFetch<GetStudentsResponseData>({ records: [] }, { status: 400 });
        render(<LoginForm />, { wrapper: getStoreWrapper(store) });

        fireEvent.change(screen.getByLabelText("student-name-input"), { target: { value: "test" } });
        fireEvent.click(screen.getByRole("button"));

        await waitFor(() => {
            expect(screen.getByTestId("screen-error")).toBeInTheDocument();
        });

        restoreConsole();
    });

    it("Should abort in-progress requests when the component unmounts", async () => {
        const abortControllerInstance = mockAbortController();
        mockFetch<GetStudentsResponseData>({ records: [] }, undefined, { timeout: Infinity });

        const { unmount } = render(<LoginForm />, { wrapper: getStoreWrapper(store) });

        fireEvent.change(screen.getByLabelText("student-name-input"), { target: { value: "test" } });
        fireEvent.click(screen.getByRole("button"));

        unmount();
        
        expect(abortControllerInstance.signal.aborted).toEqual(true);

        restoreAbortController();
    });
});
