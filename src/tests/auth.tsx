import {fireEvent, render, screen, waitForElementToBeRemoved} from "@testing-library/react";
import App from "@/App";
import {createMockStore, getStoreWrapper} from "./redux";
import {mockFetch, restoreFetch} from "./fetch";
import {GetStudentsResponseData} from "@/types/api";
import {mockAirtableStudent} from "./data";

export const loginUser = async (student = mockAirtableStudent()) => {
    const userData: GetStudentsResponseData = { records: [student] };
    mockFetch(userData);
    const { unmount } = render(<App />, { wrapper: getStoreWrapper(createMockStore()) });

    fireEvent.change(screen.getByLabelText("student-name-input"), { target: { value: student.fields.Name } });
    fireEvent.click(screen.getByRole("button"));

    await waitForElementToBeRemoved(screen.queryByTestId("login-form"));

    unmount();
    restoreFetch();
};
