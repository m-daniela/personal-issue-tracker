"use client";

import { addProject } from "@/redux/features/projectsSlice";
import { apiUrls } from "@/utils/generalConstants";
import React, {useState} from "react";
import { useDispatch } from "react-redux";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import SnackbarWrapper from "../SnackbarWrapper";


/**
 * Add project
 */
const AddProject = () => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(true);
    const [message, setMessage] = useState({
        text: "", 
        isError: false
    });

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

        if (project.error){
            setMessage({
                text: `Error while adding the project: ${project.error.message}`, 
                isError: true
            });
            setOpen(true);
        }
        else{
            setMessage({
                text: "", 
                isError: false
            });
            setOpen(false);
            e.target[0].value = "";
            dispatch(addProject(project));
        }
    };

    return (
        <>
            <section className="project-add">
                <form onSubmit={handleSumbitProject}>
                    <input type="text" placeholder="Project name..." />
                    <button type="submit"><AddOutlinedIcon /></button>
                </form>
            </section>
            {
                message.isError && 
                <SnackbarWrapper open={open} setOpen={setOpen} message={message.text} />
            }
        </>
    );
};

export default AddProject;
