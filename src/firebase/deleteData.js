import db from "@/firebase/config";
import { dbCollectionNames, errorMessageBuilder } from "@/utils/dbConstants";
import { doc, deleteDoc, writeBatch } from "firebase/firestore";
import { 
    categoryExists, 
    projectExists, 
    getTask, 
    getCategory,
    getProject
} from "./getData";
import { updateCategoryTaskArray, updateProjectCategoryArray } from "./updateData";


/**
 * Delete the project
 * The corresponding categories and tasks will
 * be deleted as well
 * @param {string} projectId 
 * @returns id of the deleted project
 */
export const deleteProject = async (projectId) => {
    const project = await getProject(projectId);
    if (!project) {
        return errorMessageBuilder(`Could not find project ${projectId}.`);
    }

    const categoryIds = project.category_order;

    categoryIds.forEach(async (categoryId) => {
        const batch = writeBatch(db);
        const category = await getCategory(projectId, categoryId);
        if (category){
            const taskIds = category.tasks;
            taskIds.forEach(taskId => {
                batch.delete(doc(db, ...dbCollectionNames.taskPath(projectId, categoryId, taskId)));
            });
            await batch.commit();
    
            await deleteDoc(doc(db, ...dbCollectionNames.categoryPath(projectId, categoryId)));
        }
    });

    await deleteDoc(doc(db, ...dbCollectionNames.projectPath(projectId)));
    
    return {
        id: projectId
    };
};


/**
 * Delete category and associated tasks
 * The category id is deleted from the project's
 * category_order array before it is deleted
 * @param {string} projectId 
 * @param {string} categoryId 
 * @returns id of the deleted category
 */
export const deleteCategory = async (projectId, categoryId) => {
    const isProject = await projectExists(projectId);
    const category = await getCategory(projectId, categoryId);
    if (!isProject) {
        return errorMessageBuilder(`Could not find project ${projectId}.`);
    }
    if (!category){
        return errorMessageBuilder(`Could not find category ${categoryId}.`);
    }

    const taskIds = category.tasks;
    const batch = writeBatch(db);

    taskIds.forEach(taskId => {
        batch.delete(doc(db, ...dbCollectionNames.taskPath(projectId, categoryId, taskId)));
    });
    await batch.commit();

    // remove category from project, so it won't be displayed
    const updateProjectMessage = await updateProjectCategoryArray(projectId, categoryId, false);
    if (updateProjectMessage.error){
        return updateProjectMessage;
    }

    await deleteDoc(doc(db, ...dbCollectionNames.categoryPath(projectId, categoryId)));
    return {
        id: categoryId
    };
};


/**
 * Delete task
 * This also deletes the task from the parent category
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
    await updateCategoryTaskArray(projectId, categoryId, taskId, false);
    
    return {
        id: taskId
    };
};