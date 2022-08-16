import faker from "@faker-js/faker";
import {render, screen} from "@testing-library/react";
import {ScreenError} from "./ScreenError";

describe("ScreenError", () => {
    it("Should render the default error message when no message is provided", () => {
        render(<ScreenError />);

        expect(screen.getByText("Something happened")).toBeInTheDocument();
    });

    it("Should render a custom error message", () => {
        const message = faker.lorem.sentence();
        render(<ScreenError message={message} />);

        expect(screen.getByText(message)).toBeInTheDocument();
    });
});
