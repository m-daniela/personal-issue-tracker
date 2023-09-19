import { deleteTask } from "@/firebase/deleteData";
import { getTask } from "@/firebase/getData";
import { updateTask, updateTaskCategory } from "@/firebase/updateData";
import { NextResponse } from "next/server";


export async function GET(request, {params}) {
    const projectId = params.projectId;
    const categoryId = params.categoryId;
    const taskId = params.taskId;
    const taskData = await getTask(projectId, categoryId, taskId);
    return NextResponse.json(taskData);
}

export async function PUT(request, {params}) {
    const taskData = await request.json();
    const projectId = params.projectId;
    const categoryId = params.categoryId;
    const taskId = params.taskId;
    let newTaskData;
    if (taskData.categoryIdTo) {
        const categoryIdFrom = categoryId;
        const categoryIdTo = taskData.categoryIdTo;
        const taskIds = taskData.taskIds;
        newTaskData = await updateTaskCategory(
            projectId, categoryIdFrom, categoryIdTo, taskId, taskIds);
    }
    else {
        newTaskData = await updateTask(projectId, categoryId, taskId, taskData);
    }
    return NextResponse.json(newTaskData);

}

export async function DELETE(request, {params}) {
    const projectId = params.projectId;
    const categoryId = params.categoryId;
    const taskId = params.taskId;
    const deletedTaskData = await deleteTask(projectId, categoryId, taskId);
    return NextResponse.json(deletedTaskData);
}