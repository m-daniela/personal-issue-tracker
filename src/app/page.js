import React from "react";
import PageHeader from "@/components/PageHeader";
import Projects from "@/components/projects/Projects";
import AddProject from "@/components/projects/AddProject";
import { setProjects } from "@/redux/features/projectsSlice";
import { APIResponseError } from "@/utils/errors/errors";
import ProjectsPreloader from "@/components/preloaders/ProjectsPreloader";
import { store } from "@/redux/store";
import { apiUrls } from "@/utils/generalConstants";

export const metadata = {
    title: "Your projects - Personal Issue Tracker",
    description: "Free Kanban style issue tracking board",
};

/**
 * Fetch and set the projects in the store.
 * This operation is done so they can be 
 * accessed in a preloader and used across
 * the project. The preloader is necessary 
 * so the projects are available in the 
 * client side as well, as setting the data
 * directly in the store state will make it
 * available only on the server side. 
 * @returns list of available projects
 */
const fetchProjects = async () => {
    const response = await fetch(apiUrls.getProjects);
    const projects = await response.json();
    store.dispatch(setProjects(projects));
    return projects; 
};


export default async function Home() {

    // const projects = await fetchProjects();
    // if(projects.error){
    //     throw new APIResponseError(projects.error.message);
    //     // notFound();
    // }
    return (
        <>
            {/* <ProjectsPreloader data={projects}/> */}
            <section>
                <PageHeader title="Projects"/>
                <AddProject />
                <Projects />
            </section>
        </>
        
    );
}
