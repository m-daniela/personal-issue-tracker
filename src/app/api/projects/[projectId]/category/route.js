import { addCategory } from "@/firebase/addData";
import { NextResponse } from "next/server";


/**
 * @swagger
 * /api/projects/{projectId}/category:
 *  post:
 *   summary: Add category
 *   description: Add a new category to the project with 
 *    id `projectId`. The added data is returned and the 
 *    `category_order` array from the parent project is 
 *    also updated.
 *   tags: 
 *   - Categories
 *   parameters:
 *   - in: path
 *     name: projectId
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
 *     description: Error while adding the category
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
    const categoryData = await request.json();
    const projectId = params.projectId;
    const newCategoryData = await addCategory(projectId, categoryData);
    return NextResponse.json(newCategoryData);
}