"use client";

import React, { useEffect } from "react";
import ProjectItem from "./ProjectItem";
import { useSelector } from "react-redux";
import { projectsSelector } from "@/redux/features/projectsSlice";
import { useSelectedProjectContext } from "../context/SelectedProjectProvider";


/**
 * Display the list of projects
 */
const Projects = () => {
    const projects = useSelector(projectsSelector);
    const {handleSelectProject} = useSelectedProjectContext();
    // reset the selected project
    useEffect(() => {
        handleSelectProject(null);
    }, [handleSelectProject]);
    
    return (
        <section className="projects">
            <ul className="projects-list">
                {projects?.map(project => <ProjectItem key={project.id} project={project}/>)}
            </ul>
        </section>
    );
};

export default Projects;
