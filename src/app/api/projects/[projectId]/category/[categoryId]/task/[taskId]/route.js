import { getTask } from "@/firebase/getData";
import { NextResponse } from "next/server";


export async function GET(request, {params}) {
    const projectId = params.projectId;
    const categoryId = params.categoryId;
    const taskId = params.taskId;
    const taskData = await getTask(projectId, categoryId, taskId);
    return NextResponse.json(taskData);
}
