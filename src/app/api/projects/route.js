import { addProject } from "@/firebase/addData";
import { getProjects } from "@/firebase/getData";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/projects:
 *  get:
 *   summary: Get projects
 *   description: Fetches the list of available projects.
 *   tags: 
 *   - Projects
 *   responses: 
 *    200:
 *     description: OK
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
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
 */
export async function GET(request) {
    const projects = await getProjects();
    return NextResponse.json(projects);
}

/**
 * @swagger
 * /api/projects:
 *  post:
 *   summary: Add project
 *   description: Add a new project.
 *   tags: 
 *   - Projects
 *   requestBody:
 *     content:
 *      application/json:
 *       schema:
 *         type: object
 *         properties:
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
 *     description: Error while adding the project
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
export async function POST(request) {
    const projectData = await request.json();
    const newProjectData = await addProject(projectData);
    return NextResponse.json(newProjectData);
}