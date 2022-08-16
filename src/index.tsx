import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {configureStore} from "@reduxjs/toolkit";
import {rootReducer} from "@/store/reducers/index";
import {Provider} from "react-redux";
import "./index.css";

const root = ReactDOM.createRoot(document.querySelector<HTMLElement>("#root")!);

export const store = configureStore({ reducer: rootReducer });


/**
 * Here I've diasbled react's strict mode to make the network tab cleaner and easier to read
 * because strict mode mounts components twice in dev mode which results in fetch requests getting fired, cancelled and then fired again.
 */
root.render(
    // <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
