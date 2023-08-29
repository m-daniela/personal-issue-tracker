"use client";

import React, { useContext, useEffect } from "react";
import { SelectedProjectContext } from "../context/SelectedProjectProvider";
import { useSelector } from "react-redux";
import { categoriesProjectIdSelector } from "@/redux/features/categoriesSlice";
import { projectSelectorById } from "@/redux/features/projectsSlice";

const Categories = () => {
    const { handleSelectProject } = useContext(SelectedProjectContext);
    // const projectId = useSelector(categoriesProjectIdSelector);
    // TODO: remove this line when the real categories are loaded
    const projectId = "iFDfhLtxrf7CGAQ2CZYs";
    const project = useSelector(projectSelectorById(projectId));

    useEffect(() => {
        handleSelectProject(project);
    }, [project]);

    return (
        <div>
            The categories list will be here
        </div>
    );
};

export default Categories;
