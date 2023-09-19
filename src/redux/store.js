import { configureStore } from "@reduxjs/toolkit";
import projectsReducer from "./features/projectsSlice";
import categoriesReducer from "./features/categoriesSlice";

export const store = configureStore({
    reducer: {
        projects: projectsReducer, 
        categories: categoriesReducer
    },
});