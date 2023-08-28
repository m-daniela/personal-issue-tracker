"use client";

import { routes } from "@/utils/generalConstants";
import Link from "next/link";
import React from "react";

/**
 * Display the project title and link to
 * the project page
 * @param {object} project 
 */
const ProjectItem = ({project}) => {
   
    return (
        <li className="project-item">
            <Link href={routes.projectRoute(project.id)}>
                {project.name}
            </Link>
        </li>
    );
};

export default ProjectItem;
