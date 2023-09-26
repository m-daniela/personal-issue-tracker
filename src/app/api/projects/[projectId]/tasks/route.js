import { getCategoriesAndTasks } from "@/firebase/getData";
import { NextResponse } from "next/server";


/**
 * @swagger
 * /api/projects/{projectId}/tasks:
 *  get:
 *   summary: Get project tasks
 *   description: Fetches all the tasks and categories 
 *    for the given `projectId`. The response contains
 *    the project id, a list of category ids, the categories
 *    and the tasks, as `itemId - itemData` pairs.
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
 *          categories: 
 *           type: object
 *           properties: 
 *            id: 
 *             type: object
 *             properties:
 *              id: 
 *               type: string
 *              name: 
 *               type: string
 *              tasks: 
 *               type: array
 *               items: 
 *                type: string 
 *              created_at: 
 *               type: object
 *               properties: 
 *                seconds: 
 *                 type: string
 *                nanoseconds: 
 *                 type: string
 *              updated_at: 
 *               type: object
 *               properties: 
 *                seconds: 
 *                 type: string
 *                nanoseconds: 
 *                 type: string
 *          tasks: 
 *           type: object
 *           properties: 
 *            id: 
 *             type: object
 *             properties:
 *              id: 
 *               type: string
 *              name: 
 *               type: string
 *              description: 
 *               type: string
 *              notes: 
 *               type: string
 *              labels: 
 *               type: array
 *               items: 
 *                type: string 
 *              created_at: 
 *               type: object
 *               properties: 
 *                seconds: 
 *                 type: string
 *                nanoseconds: 
 *                 type: string
 *              updated_at: 
 *               type: object
 *               properties: 
 *                seconds: 
 *                 type: string
 *                nanoseconds: 
 *                 type: string
 *          categoryIds: 
 *           type: array
 *           items: 
 *            type: string
 *    500:
 *     description: Error while fetching tasks
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
export async function GET(request, {params}) {
    const projectId = params.projectId;
    const categoriesAndTasks = await getCategoriesAndTasks(projectId);
    return NextResponse.json(categoriesAndTasks);
}
