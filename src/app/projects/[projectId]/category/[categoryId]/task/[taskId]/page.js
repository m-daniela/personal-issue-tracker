import Task from "@/components/tasks/Task";
import { APIResponseError } from "@/utils/errors/errors";
import { apiUrls } from "@/utils/generalConstants";
import React from "react";

export const generateMetadata = async ({params}, parent) => {
    const {projectId, categoryId, taskId} = params;
    const task = await fetchTask(projectId, categoryId, taskId);
    if (task.error) {
        return {
            title: "Error - Personal Issue Tracker"
        };
    }
    return {
        title: `${task.name} - Personal Issue Tracker`
    };
};

const fetchTask = async (projectId, categoryId, taskId) => {
    const response = await fetch(apiUrls.getTask(projectId, categoryId, taskId));
    const tasks = await response.json();
    return tasks; 
};

const TaskPage = async ({params}) => {
    const {projectId, categoryId, taskId} = params;
    const task = await fetchTask(projectId, categoryId, taskId);
    if (task.error){
        throw new APIResponseError(task.error.message);
    }
    return (
        <section className="task task-update">
            <Task projectId={projectId} categoryId={categoryId} taskData={task} />
        </section>
    );
};

export default TaskPage;