import db from "@/firebase/config";
import { dbCollectionNames, errorMessageBuilder } from "@/utils/dbConstants";
import { doc, updateDoc, Timestamp, arrayRemove, arrayUnion } from "firebase/firestore";
import { categoryExists, getTask, projectExists } from "./getData";
import { addTaskToCategory } from "./addData";
import { deleteTask } from "./deleteData";

/**
 * Update the project
 * The object is compied and modified to avoid
 * updating the timestamp in the db
 * TODO: find another workaround
 * @returns updated project data
 */
export const updateProject = async (projectId, projectData) => {
    console.log(projectId);
    const project = doc(db, ...dbCollectionNames.updateProjectPath(projectId));
    
    const projectDataWithTimestamps = {
        ...projectData, 
        updated_at: Timestamp.fromDate(new Date())
    };
    
    const projectDataToUpdate = {...projectDataWithTimestamps};
    delete projectDataToUpdate.id;
    delete projectDataToUpdate.created_at;
    
    try {
        await updateDoc(project, projectDataToUpdate);
        return projectDataWithTimestamps;
    }
    catch (error){
        return errorMessageBuilder(
            `Could not update project "${projectData.name}" - ${projectId}`, error.message);
    }
};


/**
 * Update the category array of the project
 * The category id will be added or removed based on the value
 * of the addCategory parameter 
 * @param {string} projectId 
 * @param {string} categoryId 
 * @param {string} taskId 
 * @param {boolean} addTask 
 * @returns success message if the category array was updated, 
 * error message otherwise
 */
export const updateProjectCategoryArray = async (projectId, categoryId, addCategory) => {
    const project = doc(db, ...dbCollectionNames.projectPath(projectId));
    try{
        if (addCategory) {
            await updateDoc(project, {
                category_order: arrayUnion(categoryId), 
                updated_at: Timestamp.fromDate(new Date())
            });
        }
        else {
            await updateDoc(project, {
                category_order: arrayRemove(categoryId), 
                updated_at: Timestamp.fromDate(new Date())
            });
        }
        return {
            success: {
                message: `Category list updated for project ${projectId}`
            }
        };
    }
    catch (error){
        return errorMessageBuilder(`Could not update project ${categoryId}.`, error.message);
    }
};


/**
 * Update the category
 * @param {string} projectId 
 * @param {string} categoryId 
 * @param {object} categoryData 
 * @returns updated category
 */
export const updateCategory = async (projectId, categoryId, categoryData) => {
    const isProject = await projectExists(projectId);
    const isCategory = await categoryExists(projectId, categoryId);

    if (!isProject){
        return errorMessageBuilder(`Could not find project ${projectId}.`);
    }
    if (!isCategory){
        return errorMessageBuilder(`Could not find category ${categoryId}.`);
    }

    const category = doc(db, ...dbCollectionNames.categoryPath(projectId, categoryId));
    const categoryDataWithTimestamps = {
        ...categoryData, 
        updated_at: Timestamp.fromDate(new Date())
    };
    
    const categoryDataToUpdate = {...categoryDataWithTimestamps};
    delete categoryDataToUpdate.id;
    delete categoryDataToUpdate.created_at;

    try{
        await updateDoc(category, categoryDataToUpdate);
        return categoryDataWithTimestamps;
    }
    catch (error){
        return errorMessageBuilder(`Could not update category ${categoryId}.`, error.message);
    }
};


/**
 * Update the task array
 * The task id will be added or removed based on the value
 * of the addTask parameter 
 * @param {string} projectId 
 * @param {string} categoryId 
 * @param {string} taskId 
 * @param {boolean} addTask 
 * @returns success message if the task array was updated, 
 * error message otherwise
 */
export const updateCategoryTaskArray = async (projectId, categoryId, taskId, addTask) => {
    const category = doc(db, ...dbCollectionNames.categoryPath(projectId, categoryId));
    try{
        if (addTask) {
            await updateDoc(category, {
                tasks: arrayUnion(taskId), 
                updated_at: Timestamp.fromDate(new Date())
            });
        }
        else {
            await updateDoc(category, {
                tasks: arrayRemove(taskId), 
                updated_at: Timestamp.fromDate(new Date())
            });
        }
        return {
            success: {
                message: `Tasks list updated for category ${categoryId}`
            }
        };
    }
    catch (error){
        return errorMessageBuilder(`Could not update category ${categoryId}.`, error.message);
    }
};


/**
 * Update the task
 * The object is compied and modified to avoid
 * updating the timestamp in the db
 * TODO: find another workaround
 * @returns updated task data
 */
export const updateTask = async (projectId, categoryId, taskId, taskData) => {
    const isProject = await projectExists(projectId);
    const isCategory = await categoryExists(projectId, categoryId);
    if (!isProject){
        return errorMessageBuilder(`Could not find project ${projectId}.`);
    }
    if (!isCategory){
        return errorMessageBuilder(`Could not find category ${categoryId}.`);
    }

    const task = doc(db, ...dbCollectionNames.taskPath(projectId, categoryId, taskId));
    const taskDataWithTimestamps = {
        ...taskData, 
        updated_at: Timestamp.fromDate(new Date())
    };
    
    const taskDataToUpdate = {...taskDataWithTimestamps};
    delete taskDataToUpdate.id;
    delete taskDataToUpdate.created_at;

    try{
        await updateDoc(task, taskDataToUpdate);
        return taskDataWithTimestamps;
    }
    catch (error){
        return errorMessageBuilder(`Could not update task ${taskId}.`, error.message);
    }
};


/**
 * Move the task from a category to another one
 * Add the selected task to the given category and
 * then delete it from the current category
 * @param {string} projectId 
 * @param {string} categoryIdFrom 
 * @param {string} categoryIdTo
 * @param {string} taskId 
 * @returns task data
 */
export const updateTaskCategory = async (
    projectId, categoryIdFrom, categoryIdTo, taskId, taskIds) => {
    const isProject = await projectExists(projectId);
    const isCategoryFrom = await categoryExists(projectId, categoryIdFrom);
    const isCategoryTo = await categoryExists(projectId, categoryIdTo);
    if (!isProject){
        return errorMessageBuilder(`Could not find project ${projectId}.`);
    }
    if (!isCategoryFrom && !isCategoryTo){
        return errorMessageBuilder(`Could not find category ${categoryIdFrom} or ${categoryIdTo}.`);
    }

    const task = await getTask(projectId, categoryIdFrom, taskId);
    const taskDataWithTimestamps = {
        ...task, 
        updated_at: Timestamp.fromDate(new Date())
    };
    
    try{
        if (categoryIdFrom === categoryIdTo){
            await updateCategory(projectId, categoryIdFrom, {tasks: taskIds});
        }
        else{
            await addTaskToCategory(projectId, categoryIdTo, taskDataWithTimestamps, taskIds);
            await deleteTask(projectId, categoryIdFrom, taskId);
        }
        return taskDataWithTimestamps;
    }
    catch (error){
        return errorMessageBuilder( `Could not update task "${task.name}"`, error.message);
    }
};