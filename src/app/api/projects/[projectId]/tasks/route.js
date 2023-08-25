import { getCategoriesAndTasks } from "@/firebase/getData";
import { NextResponse } from "next/server";

export async function GET(request, {params}) {
    const projectId = params.projectId;
    const categoriesAndTasks = await getCategoriesAndTasks(projectId);
    return NextResponse.json(categoriesAndTasks);
}

