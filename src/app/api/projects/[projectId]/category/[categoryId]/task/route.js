import { addTask } from "@/firebase/addData";
import { NextResponse } from "next/server";


/**
 * @swagger
 * /api/projects/{projectId}/category/{categoryId}/task:
 *  post:
 *   summary: Add task
 *   description: Add a task to the category with id `categoryId`.
 *    The added data is returned and the `tasks` array from the 
 *    parent category is updated. 
 *   tags: 
 *   - Tasks
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
 *          description: 
 *           type: string
 *          notes: 
 *           type: string
 *          labels: 
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
 *          description: 
 *           type: string
 *          notes: 
 *           type: string
 *          labels: 
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
 *     description: Error while adding the task
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
export async function POST(request, {params}) {
    const taskData = await request.json();
    const projectId = params.projectId;
    const categoryId = params.categoryId;
    const newTaskData = await addTask(projectId, categoryId, taskData);
    return NextResponse.json(newTaskData);
}