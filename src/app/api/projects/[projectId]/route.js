import { deleteProject } from "@/firebase/deleteData";
import { updateProject } from "@/firebase/updateData";
import { NextResponse } from "next/server";


/**
 * @swagger
 * /api/projects/{projectId}:
 *  put:
 *   summary: Update project
 *   description: Updates the project associated with 
 *    `projectId`. The updated data is returned. 
 *   tags: 
 *   - Projects
 *   parameters:
 *   - in: path
 *     name: projectId
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
 *          category_order: 
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
 *          category_order: 
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
 *     description: Error while updating the project
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
    const projectId = params.projectId;
    const projectData = await request.json();
    const newProjectData = await updateProject(projectId, projectData);
    return NextResponse.json(newProjectData);
}


/**
 * @swagger
 * /api/projects/{projectId}:
 *  delete:
 *   summary: Delete project
 *   description: Delete the project associated with `projectId`.
 *    If this operation was successful, `projectId` is returned. 
 *   tags: 
 *   - Projects
 *   parameters:
 *   - in: path
 *     name: projectId
 *     schema:
 *      type: string
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
 *     description: Error while deleting the project
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
    const deletedProjectData = await deleteProject(projectId);
    return NextResponse.json(deletedProjectData);
}