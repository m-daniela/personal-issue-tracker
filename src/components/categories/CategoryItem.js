import React from "react";
import TaskPreview from "../tasks/TaskPreview";
import Link from "next/link";
import { routes } from "@/utils/generalConstants";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";


/**
 * Display the category item
 * This holds the available task present in a category
 * The link to the add task page is added at the "top"
 * of the category, the url params being properly set
 * @param {object} category 
 * @param {string} projectId 
 */
const CategoryItem = ({category, projectId}) => {
    return (
        <div className="category-item">
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
