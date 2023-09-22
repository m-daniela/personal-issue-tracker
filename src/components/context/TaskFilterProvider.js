"use client";

import { FilterError } from "@/utils/errors/errors";
import React, { createContext, useContext, useState } from "react";


export const TaskFilterContext = createContext({
    query: "", 
    labels: []
});

export const useTaskFilterContext = () => {
    const context = useContext(TaskFilterContext);
    if (!context){
        throw new FilterError(
            "There was an error while creating the task filter. Please try again.");
    }
    return context;
};

const TaskFilterProvider = ({children}) => {
    const [query, setQuery] = useState({
        query: "", 
        labels: []
    });

    const setSearchString = (searchString) => {
        setQuery(state => {
            return {
                ...state, 
                ...searchString
            };
        });
    };

    return (
        <TaskFilterContext.Provider value={{query, setSearchString}}>
            {children}
        </TaskFilterContext.Provider>
    );
};

export default TaskFilterProvider;
