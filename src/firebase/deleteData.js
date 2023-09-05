import db from "@/firebase/config";
import { dbCollectionNames, errorMessageBuilder } from "@/utils/dbConstants";
import { doc, deleteDoc, writeBatch } from "firebase/firestore";
import { 
    getCategoryIdsFromProject, 
    getTaskIdsFromCategory, 
    categoryExists, 
    projectExists, 
    getTask 
} from "./getData";


/**
 * Delete the project
 * The corresponding categories and tasks will
 * be deleted as well
 * @param {string} projectId 
 * @returns id of the deleted project
 */
export const deleteProject = async (projectId) => {
    const isProject = await projectExists(projectId);
    if (!isProject) {
        return errorMessageBuilder(`Could not find project ${projectId}.`);
    }

    const categoryIds = await getCategoryIdsFromProject(projectId);

    categoryIds.forEach(async (categoryId) => {
        const batch = writeBatch(db);
        const taskIds = await getTaskIdsFromCategory(projectId, categoryId);
        taskIds.forEach(taskId => {
            batch.delete(doc(db, ...dbCollectionNames.taskPath(projectId, categoryId, taskId)));
        });
        await batch.commit();

        await deleteDoc(doc(db, ...dbCollectionNames.categoryPath(projectId, categoryId)));
    });

    await deleteDoc(doc(db, ...dbCollectionNames.projectPath(projectId)));
    
    return {
        id: projectId
    };
};


/**
 * Delete task
 * @param {string} projectId 
 * @param {string} categoryId 
 * @param {string} taskId 
 * @returns id of the deleted task
 */
export const deleteTask = async (projectId, categoryId, taskId) => {
    const isProject = await projectExists(projectId);
    const isCategory = await categoryExists(projectId, categoryId);
    if (!isProject){
        return errorMessageBuilder(`Could not find project ${projectId}.`);
    }
    if (!isCategory){
        return errorMessageBuilder(`Could not find category ${categoryId}.`);
    }
    const task = await getTask(projectId, categoryId, taskId);
    if ("error" in task){
        return errorMessageBuilder(task.error.message, data=task);
    }
    await deleteDoc(doc(db, ...dbCollectionNames.taskPath(projectId, categoryId, taskId)));
    return {
        id: taskId
    };
};