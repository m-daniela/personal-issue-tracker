import { addProject } from "@/firebase/addData";
import { getProjects } from "@/firebase/getData";
import { NextResponse } from "next/server";

export async function GET(request) {
    const projects = await getProjects();
    return NextResponse.json(projects);
}

export async function POST(request) {
    const projectData = await request.json();
    const newProjectData = await addProject(projectData);
    return NextResponse.json(newProjectData);
}