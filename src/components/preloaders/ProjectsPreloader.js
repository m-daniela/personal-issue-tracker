"use client";

import React from "react";
import Preloader from "./Preloader";
import { setProjects } from "@/redux/features/projectsSlice";


/**
 * Wrapper for the data preloader
 * It passes the data which needs to be
 * loaded in the store and the reducer 
 * function that handles this
 * This is a workaround since you can't 
 * pass functions to client components
 * from server components
 * @param {object} data 
 */
const ProjectsPreloader = ({data}) => {
    return (
        <Preloader action={setProjects} data={data} />
    );
};

export default ProjectsPreloader;
