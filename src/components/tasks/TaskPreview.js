"use client";
import { getTaskById } from "@/redux/features/categoriesSlice";
import React from "react";
import { useSelector } from "react-redux";

/**
 * Display the task in a card
 * @param {string} projectId 
 * @param {string} categoryId
 * @param {string} taskId
 * @returns 
 */
const TaskPreview = ({projectId, categoryId, taskId}) => {
    const task = useSelector(getTaskById(taskId));

    return (
        <div className="tasks task-preview">
            <span className="task-title"><strong>{task.name}</strong></span>
            
            <div>{task.description}
            </div>
        </div>
    );
};

export default TaskPreview;
