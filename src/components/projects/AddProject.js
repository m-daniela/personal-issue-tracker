"use client";

import { addProject } from "@/redux/features/projectsSlice";
import { apiUrls } from "@/utils/generalConstants";
import React from "react";
import { useDispatch } from "react-redux";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";


/**
 * Add project
 */
const AddProject = () => {
    const dispatch = useDispatch();

    const handleSumbitProject = async (e) => {
        e.preventDefault();
        const projectName = e.target[0].value;
        const response = await fetch(
            apiUrls.createProject, 
            {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({name: projectName})
            });
        const project = await response.json();

        e.target[0].value = "";
        dispatch(addProject(project));
    };

    return (
        <section className="project-add">
            <form onSubmit={handleSumbitProject}>
                <input type="text" placeholder="Project name..." />
                <button type="submit"><AddOutlinedIcon /></button>
            </form>
        </section>
    );
};

export default AddProject;
