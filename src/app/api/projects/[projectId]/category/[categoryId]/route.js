import { deleteCategory, deleteTask } from "@/firebase/deleteData";
import { getTask } from "@/firebase/getData";
import { updateCategory, updateTask, updateTaskCategory } from "@/firebase/updateData";
import { NextResponse } from "next/server";


/**
 * @swagger
 * /api/projects/{projectId}/category/{categoryId}:
 *  put:
 *   summary: Update category
 *   description: Update the category with id `categoryId`. 
 *    The updated data is returned.
 *   tags: 
 *   - Categories
 *   parameters:
 *   - in: path
 *     name: projectId
 *     required: true
 *     schema:
 *      type: string
 *   - in: path
 *     name: categoryId
 *     required: true
 *     schema:
 *      type: string
 *   requestBody:
 *     content:
 *      application/json:
 *       schema:
 *         type: object
 *         properties:
 *          id: 
 *           type: string
 *          name: 
 *           type: string
 *          tasks: 
 *           type: array
 *           items:
 *            type: string
 *   responses: 
 *    200:
 *     description: OK
 *     content:
 *      application/json:
 *       schema:
 *         type: object
 *         properties:
 *          id: 
 *           type: string
 *          name: 
 *           type: string
 *          tasks: 
 *           type: array
 *           items: 
 *            type: string 
 *          created_at: 
 *           type: object
 *           properties: 
 *            seconds: 
 *              type: string
 *            nanoseconds: 
 *              type: string
 *          updated_at: 
 *           type: object
 *           properties: 
 *            seconds: 
 *              type: string
 *            nanoseconds: 
 *              type: string
 *    500:
 *     description: Error while updating the category
 *     content:
 *      application/json:
 *       schema:
 *         type: object
 *         properties:
 *          error:
 *           type: object
 *           properties: 
 *            message: 
 *             type: string
 *            data: 
 *             type: object
 */
export async function PUT(request, {params}) {
    const categoryData = await request.json();
    const projectId = params.projectId;
    const categoryId = params.categoryId;
    
    const updatedCategory = await updateCategory(projectId, categoryId, categoryData);
    return NextResponse.json(updatedCategory);
}


/**
 * @swagger
 * /api/projects/{projectId}/category/{categoryId}:
 *  delete:
 *   summary: Delete category
 *   description: Delete the category with id `categoryId` from 
 *    the project with id `projectId`. If this operation was 
 *    successfull, `categoryId` is returned and the `category_order`
 *    array from the parent project is updated. 
 *   tags: 
 *   - Categories
 *   parameters:
 *   - in: path
 *     name: projectId
 *     required: true
 *     schema:
 *      type: string
 *   - in: path
 *     name: categoryId
 *     required: true
 *     schema:
 *      type: string
 *   requestBody:
 *     content:
 *      application/json:
 *       schema:
 *         type: object
 *         properties:
 *          id: 
 *           type: string
 *   responses: 
 *    200:
 *     description: OK
 *     content:
 *      application/json:
 *       schema:
 *         type: object
 *         properties:
 *          id: 
 *           type: string
 *    500:
 *     description: Error while deleting the category
 *     content:
 *      application/json:
 *       schema:
 *         type: object
 *         properties:
 *          error:
 *           type: object
 *           properties: 
 *            message: 
 *             type: string
 *            data: 
 *             type: object
 */
export async function DELETE(request, {params}) {
    const projectId = params.projectId;
    const categoryId = params.categoryId;
    const deletedCategoryData = await deleteCategory(projectId, categoryId);
    return NextResponse.json(deletedCategoryData);
}