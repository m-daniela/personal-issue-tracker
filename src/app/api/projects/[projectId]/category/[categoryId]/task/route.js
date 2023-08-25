import { addTask } from "@/firebase/addData";
import { NextResponse } from "next/server";


export async function POST(request, {params}) {
    const taskData = await request.json();
    const projectId = params.projectId;
    const categoryId = params.categoryId;
    const newTaskData = await addTask(projectId, categoryId, taskData);
    return NextResponse.json(newTaskData);
}