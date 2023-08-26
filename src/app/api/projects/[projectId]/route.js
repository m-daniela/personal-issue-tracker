import { updateProject } from "@/firebase/updateData";
import { NextResponse } from "next/server";

export async function PUT(request, {params}) {
    const projectId = params.projectId;
    const projectData = await request.json();
    const newProjectData = await updateProject(projectId, projectData);
    return NextResponse.json(newProjectData);
}