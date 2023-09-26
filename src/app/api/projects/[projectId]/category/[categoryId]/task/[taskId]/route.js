import { deleteTask } from "@/firebase/deleteData";
import { getTask } from "@/firebase/getData";
import { updateTask, updateTaskCategory } from "@/firebase/updateData";
import { NextResponse } from "next/server";


/**
 * @swagger
 * /api/projects/{projectId}/category/{categoryId}/task/{taskId}:
 *  get:
 *   summary: Get task
 *   description: Get the task with id `taskId`.
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
 *   - in: path
 *     name: taskId
 *     required: true
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
 *     description: Error while getting the task
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
    const categoryId = params.categoryId;
    const taskId = params.taskId;
    const taskData = await getTask(projectId, categoryId, taskId);
    return NextResponse.json(taskData);
}


/**
 * @swagger
 * /api/projects/{projectId}/category/{categoryId}/task/{taskId}:
 *  put:
 *   summary: Update task
 *   description: Update the task with id `taskId`. The updated 
 *    data is returned. 
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
 *   - in: path
 *     name: taskId
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
 *     description: Error while updating the task
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
    const taskData = await request.json();
    const projectId = params.projectId;
    const categoryId = params.categoryId;
    const taskId = params.taskId;
    let newTaskData;
    if (taskData.categoryIdTo) {
        const categoryIdFrom = categoryId;
        const categoryIdTo = taskData.categoryIdTo;
        const taskIds = taskData.taskIds;
        newTaskData = await updateTaskCategory(
            projectId, categoryIdFrom, categoryIdTo, taskId, taskIds);
    }
    else {
        newTaskData = await updateTask(projectId, categoryId, taskId, taskData);
    }
    return NextResponse.json(newTaskData);

}


/**
 * @swagger
 * /api/projects/{projectId}/category/{categoryId}/task/{taskId}:
 *  delete:
 *   summary: Delete task
 *   description: Delete the task with id `taskId`. If this operation
 *    is successful, the task id is returned and the `tasks` array from 
 *    the parent category is also updated. 
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
 *   - in: path
 *     name: taskId
 *     required: true
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
 *     description: Error while deleting the task
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
    const taskId = params.taskId;
    const deletedTaskData = await deleteTask(projectId, categoryId, taskId);
    return NextResponse.json(deletedTaskData);
}