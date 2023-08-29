"use client";

import React, { useContext, useEffect } from "react";
import CategoryItem from "./CategoryItem";
import { useSelector } from "react-redux";
import { categoriesProjectIdSelector, categoriesSelector } from "@/redux/features/categoriesSlice";
import { SelectedProjectContext } from "../context/SelectedProjectProvider";
import { projectSelectorById } from "@/redux/features/projectsSlice";


/**
 * Display the list of categories
 */
const Categories = () => {
    const { handleSelectProject } = useContext(SelectedProjectContext);
    const categories = useSelector(categoriesSelector);
    const projectId = useSelector(categoriesProjectIdSelector);
    const project = useSelector(projectSelectorById(projectId));
    useEffect(() => {
        handleSelectProject(project);
    }, [project]);

    return (<section className="categories">
        {
            Object.values(categories)?.map(category => <CategoryItem 
                key={category.id} 
                category={category} 
                projectId={projectId} />)
        }
    </section>
    );
};

export default Categories;
