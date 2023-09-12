"use client";

import React from "react";
import TaskPreview from "../tasks/TaskPreview";
import Link from "next/link";
import { routes } from "@/utils/generalConstants";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { useSortable } from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";


/**
 * Display the category item
 * This holds the available task present in a category
 * The link to the add task page is added at the "top"
 * of the category, the url params being properly set
 * @param {object} category 
 * @param {string} projectId 
 */
const CategoryItem = ({category, projectId}) => {
    const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({
        id: category.id, 
        data: {
            type: "Column", 
            category
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };

    if (isDragging){
        return (<div className="category-item" ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}>
           
        </div>);
    }
    return (
        <div className="category-item" ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}>
            <h2>{category.name}</h2>
            <Link className="add-task-link" href={routes.addTaskRoute(projectId, category.id)}>
                <AddOutlinedIcon />Add task
            </Link>
            {Object.values(category.tasks)?.map(taskId => <Link 
                href={routes.taskRoute(projectId, category.id, taskId)}
                key={taskId}>
                <TaskPreview projectId={projectId} categoryId={category.id} taskId={taskId} />
            </Link>)}
        </div>
    );
};

export default CategoryItem;
