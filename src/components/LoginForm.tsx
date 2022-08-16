import React from "react";
import {fetchUser} from "@/store/actions/user";
import {useAppDispatch} from "@/hooks/redux";
import {useSelector} from "react-redux";
import {userSelector} from "@/store/selectors/user";
import {ScreenLoader} from "./ScreenLoader";
import {ScreenError} from "./ScreenError";


export const LoginForm: React.FC = () => {
    const [name, setName] = React.useState<string>("");
    const user = useSelector(userSelector);
    const dispatch = useAppDispatch();
    const abortRef = React.useRef<() => void>();

    const handleNameChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) =>
        setName(event.target.value), [setName]);

    const handleSubmit = React.useCallback((event: React.FormEvent) => {
        abortRef.current?.();

        event.preventDefault();
        const {dispatcher, abort} = fetchUser(name);
        dispatch(dispatcher);

        abortRef.current = abort;
    }, [dispatch, name]);

    React.useEffect(() => () => abortRef.current?.(), [abortRef]);

    return (
        <form onSubmit={handleSubmit} data-testid="login-form">
            <div className="centered">
                <h1 style={{ textAlign: "center" }}>Login</h1>
                <div>
                    <label htmlFor="name">Student Name: </label>
                    <input type="text"
                           required
                           value={name}
                           aria-label="student-name-input"
                           placeholder="The name of the student"
                           onChange={handleNameChange} />
                </div>
                {user.isLoading && <ScreenLoader />}
                {user.error && <ScreenError message={user.error} />}
                <button type="submit" disabled={user.isLoading}>Login</button>
            </div>
        </form>
    );
};
