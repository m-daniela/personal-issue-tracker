import { apiUrls } from "@/utils/generalConstants";

const headers = {
    "Content-type": "application/json",
};


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
 * 
 * @param {string} projectId 
 * @param {string} categoryIdFrom 
 * @param {string} categoryIdTo 
 * @param {string} taskId 
 */
export const apiUpdateTaskAndCategory = async (
    projectId, categoryIdFrom, categoryIdTo, taskId, taskIds) => {
    console.log(projectId, categoryIdFrom, categoryIdTo, taskId, taskIds);
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
    const uTask = await response.json();
    console.log(uTask);
    return uTask;
};