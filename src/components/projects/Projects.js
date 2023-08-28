"use client";

import React from "react";
import { useSelector } from "react-redux";
import { projectsSelector } from "@/redux/features/projectsSlice";
import ProjectItem from "@/components/projects/ProjectItem";


/**
 * Display the list of projects
 */
const Projects = () => {
    const projects = useSelector(projectsSelector);
    
    return (
        <section className="projects">
            <ul className="projects-list">
                {projects.map(project => <ProjectItem key={project.id} project={project}/>)}
            </ul>
        </section>
    );
};

export default Projects;
