import React from "react";

interface ScreenErrorProps {
    readonly message?: string;
}

export const ScreenError: React.FC<ScreenErrorProps> = (props) => {
    const { message = "Something happened" } = props;

    return <div data-testid="screen-error" className="error">{message}</div>;
};
