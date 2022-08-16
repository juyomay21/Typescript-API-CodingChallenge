import {cleanup, fireEvent, render, screen, waitForElementToBeRemoved} from "@testing-library/react";
import {App} from "./App";
import {createMockStore, getStoreWrapper} from "@/tests/redux";
import {loginUser} from "./tests/auth";
import faker from "@faker-js/faker";
import {mockConsole, restoreConsole} from "./tests/console";

describe("App", () => {
    let store: ReturnType<typeof createMockStore>;

    beforeEach(() => {
        store = createMockStore();
    });

    afterEach(() => {
        window.localStorage.clear();
        cleanup();
    });

    it("Should render the login form when there's no logged in user", () => {
        render(<App />, { wrapper: getStoreWrapper(store) });

        expect(screen.getByLabelText("student-name-input")).toBeInTheDocument();
    });

    it("Should logout users", async () => {
        await loginUser();

        const authenticatedStore = createMockStore();
        render(<App />, { wrapper: getStoreWrapper(authenticatedStore) })
        const logoutButton = screen.getByText("Logout");

        fireEvent.click(logoutButton);

        // Should show the login screen
        expect(screen.getByTestId("login-form")).toBeInTheDocument();
    });

    it("Should keep users authenticated even after a page refresh (should keep the user's session)", async () => {
        await loginUser();

        const newStore = createMockStore();
        render(<App />, { wrapper: getStoreWrapper(newStore) })

        expect(screen.queryByTestId("login-form")).toBeNull();
        expect(screen.getByTestId("user-classes-view")).toBeInTheDocument();
    });

    it("Should not crash when an invalid user data is found in localstorage", () => {
        mockConsole();

        const invalidJSON = faker.lorem.sentence();
        window.localStorage.setItem("user", invalidJSON);

        const newStore = createMockStore();
        render(<App />, { wrapper: getStoreWrapper(newStore) })

        expect(screen.getByTestId("login-form")).toBeInTheDocument();

        expect(console.error).toHaveBeenCalled();

        restoreConsole();
    });
});
