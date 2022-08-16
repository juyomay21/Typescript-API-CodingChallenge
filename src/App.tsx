import React from "react";
import {useSelector} from "react-redux";
import "./App.css";
import {userSelector} from "@/store/selectors/user";
import {LoginForm} from "./components/LoginForm";
import {UserClasses} from "./components/UserClasses";
import {useAppDispatch} from "./hooks/redux";
import {CLASSES_ACTIONS} from "./store/reducers/classes";
import {USER_ACTIONS} from "./store/reducers/user";

export const App: React.FC = () => {
    const { data: userData } = useSelector(userSelector);
    const isLoggedIn = !! userData;
    const dispatch = useAppDispatch();

    const logout = React.useCallback(() => {
        dispatch(CLASSES_ACTIONS.CLEAR());
        dispatch(USER_ACTIONS.CLEAR());
        window.localStorage.removeItem("user");
    }, [dispatch]);

    React.useEffect(() => {
        if (userData) {
            window.localStorage.setItem("user", JSON.stringify(userData));
        }
    }, [userData]);


    // Ideally we would use react-router here or something similar
    return (
        <>
            {isLoggedIn && (
                <div>
                    <b style={{ marginRight: 10 }}>{userData.name}</b>
                    <button onClick={logout}>Logout</button>
                </div>
            )}
            <div className="container">
                {isLoggedIn
                    ? <UserClasses />
                    : <LoginForm />
                }
            </div>
        </>
    );
};

export default App;
