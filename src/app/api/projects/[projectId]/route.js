import { deleteProject } from "@/firebase/deleteData";
import { updateProject } from "@/firebase/updateData";
import { NextResponse } from "next/server";

export async function PUT(request, {params}) {
    const projectId = params.projectId;
    const projectData = await request.json();
    const newProjectData = await updateProject(projectId, projectData);
    return NextResponse.json(newProjectData);
}

export async function DELETE(request, {params}) {
    const projectId = params.projectId;
    const deletedProjectData = await deleteProject(projectId);
    return NextResponse.json(deletedProjectData);
}