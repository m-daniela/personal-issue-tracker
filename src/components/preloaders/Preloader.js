"use client";

import { store } from "@/redux/store";
import { useRef } from "react";

/**
 * This is a preloader that moves the data from the
 * "ssr redux" store to the client
 * I have chosen to create different components to
 * handle this since there are errors when passing
 * a function from a server component to a client
 * component. This will be updated when the server
 * actions feature will pass the alpha phase
 */
const Preloader = ({ action, data }) => {
    const loadedData = useRef(false);
    if (!loadedData.current) {
        store.dispatch(action(data));
        loadedData.current = true;
    }
    return null;
};

export default Preloader;
