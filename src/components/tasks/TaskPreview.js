"use client";
import { deleteTaskFromCategory, getTaskById } from "@/redux/features/categoriesSlice";
import { apiUrls } from "@/utils/generalConstants";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

/**
 * Display the task in a card
 * @param {string} projectId 
 * @param {string} categoryId
 * @param {string} taskId
 */
const TaskPreview = ({projectId, categoryId, taskId}) => {
    const task = useSelector(getTaskById(taskId));
    const dispatch = useDispatch();

    const handleDelete = async (e) => {
        e.preventDefault();

        const response = await fetch(apiUrls.deleteTask(projectId, categoryId, taskId), {
            method: "DELETE", 
        });
        const {id: removedTask} = await response.json();
        dispatch(deleteTaskFromCategory({categoryId, taskId: removedTask}));
    };

    return (
        <div className="tasks task-preview">
            <div className="controls">
                <span className="task-title"><strong>{task.name}</strong></span>
                <span className="delete-button" onClick={handleDelete}>
                    <DeleteOutlineOutlinedIcon />
                </span>
            </div>
            <div>{task.description}
                <div className="overlay"></div>
            </div>
        </div>
    );
};

export default TaskPreview;
