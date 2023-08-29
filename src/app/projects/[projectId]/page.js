import PageHeader from "@/components/PageHeader";
import Categories from "@/components/categories/Categories";
import React from "react";


const ProjectPage = () => {
    return (
        <section>
            <PageHeader title="Your tasks" />
            <Categories />
        </section>
    );
};

export default ProjectPage;
