import { getProjects } from "@/firebase/getData";
import { NextResponse } from "next/server";

export async function GET(request) {
    const projects = await getProjects();
    return NextResponse.json(projects);
}
