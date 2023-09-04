"use client";

import { deleteProject, updateProject } from "@/redux/features/projectsSlice";
import { apiUrls, routes } from "@/utils/generalConstants";
import Link from "next/link";
import React, {useState} from "react";
import { useDispatch } from "react-redux";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import SnackbarWrapper from "../SnackbarWrapper";


/**
 * Display the title of the project and access 
 * the project page
 * This component allows updating the project 
 * title by switching to update mode, as well
 * as deleting it by clicking the delete button
 * @param {object} project 
 */
const ProjectItem = ({project}) => {
    const dispatch = useDispatch();
    const [updateOn, setUpdateOn] = useState(false);
    const [projectName, setProjectName] = useState(project.name);
    const [open, setOpen] = useState(true);
    const [message, setMessage] = useState({
        text: "", 
        isError: false
    });

    const handleUpdateProject = (e) => {
        e.preventDefault();
        setUpdateOn(state => !state);
    };

    const handleDeleteProject = async (e) => {
        e.preventDefault();
        const response = await fetch(
            apiUrls.deleteProject(project.id), 
            {
                method: "DELETE",
            });
        const deletedProjectId = await response.json();
        if (deletedProjectId.error) {
            setMessage({
                text: `Error while deleting the project: ${deletedProjectId.error.message}`, 
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
            dispatch(deleteProject(deletedProjectId));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(
            apiUrls.updateProject(project.id), 
            {
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    ...project, 
                    name: projectName
                })
            });
        const updatedProject = await response.json();
        if (updatedProject.error) {
            setMessage({
                text: `Error while updating the project: ${updatedProject.error.message}`, 
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
            dispatch(updateProject(updatedProject));
            setUpdateOn(state => !state);
        }
        
    };
    
    return (
        <>
            <li className="project-item">
                {
                    updateOn ? 
                        <>
                            <input 
                                type="text" 
                                value={projectName} 
                                onChange={e => setProjectName(e.target.value)} />
                            <button type="submit" onClick={handleSubmit}>
                                <DoneOutlinedIcon />
                            </button>
                            <button onClick={handleUpdateProject}><CloseOutlinedIcon /></button>
                        </>
                        :
                        <>
                            <Link href={routes.projectRoute(project.id)}>
                                {project?.name}
                            </Link>
                            <button onClick={handleUpdateProject}><EditOutlinedIcon /></button>
                            <button onClick={handleDeleteProject}>
                                <DeleteOutlineOutlinedIcon />
                            </button>
                        </>
                }
            </li>
            { 
                message.isError && 
                <SnackbarWrapper open={open} setOpen={setOpen} message={message.text} />}
        </>
        
    );
};

export default ProjectItem;
