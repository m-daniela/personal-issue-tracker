"use client";
import { deleteTaskFromCategory, getTaskById } from "@/redux/features/categoriesSlice";
import { apiUrls, routes, draggableStyle } from "@/utils/generalConstants";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import SnackbarWrapper from "../SnackbarWrapper";
import { TaskLabelSimple } from "./TaskLabels";
import Link from "next/link";
import { useSortable } from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";

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

    const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({
        id: task.id, 
        data: {
            type: "task", 
            task: task,
            categoryId
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };

    const handleDelete = async (e) => {
        e.preventDefault();

        const response = await fetch(apiUrls.deleteTask(projectId, categoryId, task.id), {
            method: "DELETE", 
        });
        const removedTask = await response.json();
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

    if (isDragging){
        return (<div className="tasks task-preview dragging"
            ref={setNodeRef}
            style={{
                ...style,
                ...draggableStyle
            }}
            {...attributes}
            {...listeners}
        />);
    }

    return (<>
        <Link href={routes.taskRoute(projectId, categoryId, task.id)} >
            <div 
                className="tasks task-preview"
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}>
                <div className="controls">
                    <span className="task-title"><strong>{task.name}</strong></span>
                    <span className="delete-button" onClick={handleDelete}>
                        <DeleteOutlineOutlinedIcon />
                    </span>
                </div>
                <div className="task-labels">
                    {
                        task.labels.map((label, index) => <TaskLabelSimple 
                            key={index} 
                            label={label}/>)
                    }
                </div>
                <div>{task.description}
                    {/* <div className="overlay"></div> */}
                </div>
            </div>
        </Link>
        {
            message.isError && 
                <SnackbarWrapper open={open} setOpen={setOpen} message={message.text} />
        }
    </>
        
    );
};

export default TaskPreview;
