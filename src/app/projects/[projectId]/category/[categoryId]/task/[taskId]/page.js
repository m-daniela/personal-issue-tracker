import Task from "@/components/tasks/Task";
import { apiUrls } from "@/utils/generalConstants";
import React from "react";

export const generateMetadata = async ({params}, parent) => {
    const {projectId, categoryId, taskId} = params;
    const task = await fetchTask(projectId, categoryId, taskId);
    console.log("metadata", task);
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
    return (
        <section className="task task-update">
            <Task projectId={projectId} categoryId={categoryId} taskData={task} />
        </section>
    );
};

export default TaskPage;