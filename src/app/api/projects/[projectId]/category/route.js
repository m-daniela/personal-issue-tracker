import { addCategory } from "@/firebase/addData";
import { NextResponse } from "next/server";


export async function POST(request, {params}) {
    const categoryData = await request.json();
    const projectId = params.projectId;
    const newCategoryData = await addCategory(projectId, categoryData);
    return NextResponse.json(newCategoryData);
}