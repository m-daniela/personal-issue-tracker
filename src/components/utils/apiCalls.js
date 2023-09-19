import { apiUrls } from "@/utils/generalConstants";

const headers = {
    "Content-type": "application/json",
};

/**
 * Update project call
 * @param {object} project 
 * @returns response with project data or error message
 */
export const apiUpdateProject = async (project) => {
    const response = await fetch(
        apiUrls.updateProject(project.id), 
        {
            method: "PUT",
            headers,
            body: JSON.stringify(project)
        });
    return await response.json();
};


/**
 * Update task call
 * Updates the tasks list from the category and moves
 * the task to the specified category, if needed
 * @param {string} projectId 
 * @param {string} categoryIdFrom 
 * @param {string} categoryIdTo 
 * @param {string} taskId 
 * @returns response with task data or error message
 */
export const apiUpdateTaskAndCategory = async (
    projectId, categoryIdFrom, categoryIdTo, taskId, taskIds) => {
    const response = await fetch(
        apiUrls.updateTask(projectId, categoryIdFrom, taskId), 
        {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                categoryIdTo, 
                taskIds
            })
        });
    const updatedTask = await response.json();
    return updatedTask;
};