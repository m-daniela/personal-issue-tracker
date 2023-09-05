"use client";
import { deleteTaskFromCategory, getTaskById } from "@/redux/features/categoriesSlice";
import { apiUrls } from "@/utils/generalConstants";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import SnackbarWrapper from "../SnackbarWrapper";

/**
 * Display the task in a card
 * @param {string} projectId 
 * @param {string} categoryId
 * @param {string} taskId
 */
const TaskPreview = ({projectId, categoryId, taskId}) => {
    const [open, setOpen] = useState(true);
    const [message, setMessage] = useState({
        text: "", 
        isError: false
    });
    const task = useSelector(getTaskById(taskId));
    const dispatch = useDispatch();

    const handleDelete = async (e) => {
        e.preventDefault();

        const response = await fetch(apiUrls.deleteTask(projectId, categoryId, taskId), {
            method: "DELETE", 
        });
        const removedTask = await response.json();
        console.log(removedTask);
        if (removedTask.error) {
            setMessage({
                text: `Error while deleting the task: ${removedTask.error.message}`, 
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
            dispatch(deleteTaskFromCategory({categoryId, taskId: removedTask.id}));
        }
    };

    return (
        <>
            <div className="tasks task-preview">
                <div className="controls">
                    <span className="task-title"><strong>{task.name}</strong></span>
                    <span className="delete-button" onClick={handleDelete}>
                        <DeleteOutlineOutlinedIcon />
                    </span>
                </div>
                <div>{task.description}
                    {/* <div className="overlay"></div> */}
                </div>
            </div>
            {
                message.isError && 
                <SnackbarWrapper open={open} setOpen={setOpen} message={message.text} />
            }</>
        
    );
};

export default TaskPreview;
