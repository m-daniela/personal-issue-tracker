import React from "react";
import PageHeader from "@/components/PageHeader";
import AddTask from "@/components/tasks/AddTask";

export const metadata = {
    title: "Add a new task - Personal Issue Tracker"
};

const AddTaskPage = ({params}) => {
    const {projectId, categoryId} = params;
    return (
        <section className="task">
            <PageHeader title="Add new task" />
            <section className="task task-add">
                <AddTask projectId={projectId} categoryId={categoryId} />
            </section>
        </section>
    );
};

export default AddTaskPage;
