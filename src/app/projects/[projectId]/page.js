import Categories from "@/components/categories/Categories";
import { apiUrls } from "@/utils/generalConstants";
import React from "react";
import CategoriesPreloader from "@/components/preloaders/CategoriesPreloader";
import PageHeader from "@/components/PageHeader";


export const metadata = {
    title: "Your project - Personal Issue Tracker"
};

const fetchCategoriesAndTasks = async (projectId) => {
    const response = await fetch(apiUrls.getCategoriesAndTasks(projectId), {cache: "no-store"});
    const tasks = await response.json();
    return tasks; 
};

const ProjectPage = async ({params}) => {
    const projectId = params.projectId;
    const data = await fetchCategoriesAndTasks(projectId);

    return (
        <section>
            <PageHeader title="Your tasks" />
            <CategoriesPreloader data={data} />
            <Categories />
        </section>
    );
};

export default ProjectPage;
