import { deleteCategory, deleteTask } from "@/firebase/deleteData";
import { getTask } from "@/firebase/getData";
import { updateCategory, updateTask, updateTaskCategory } from "@/firebase/updateData";
import { NextResponse } from "next/server";


export async function PUT(request, {params}) {
    const categoryData = await request.json();
    const projectId = params.projectId;
    const categoryId = params.categoryId;
    
    const updatedCategory = await updateCategory(projectId, categoryId, categoryData);
    return NextResponse.json(updatedCategory);

}

export async function DELETE(request, {params}) {
    const projectId = params.projectId;
    const categoryId = params.categoryId;
    const deletedCategoryData = await deleteCategory(projectId, categoryId);
    return NextResponse.json(deletedCategoryData);
}