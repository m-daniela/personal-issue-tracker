import db from "@/firebase/config";
import { dbCollectionNames, errorMessageBuilder } from "@/utils/dbConstants";
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { categoryExists, projectExists } from "./getData";


/**
 * Update the project
 * The object is compied and modified to avoid
 * updating the timestamp in the db
 * TODO: find another workaround
 * @returns updated project data
 */
export const updateProject = async (projectId, projectData) => {
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
        return errorMessageBuilder(`Could not update project "${projectData.name}"`, error.message);
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
    const task = doc(db, ...dbCollectionNames.taskPath(projectId, categoryId, taskId));
    const taskDataWithTimestamps = {
        ...taskData, 
        updated_at: Timestamp.fromDate(new Date())
    };
    
    const taskDataToUpdate = {...taskDataWithTimestamps};
    delete taskDataToUpdate.id;
    delete taskDataToUpdate.created_at;

    const isProject = await projectExists(projectId);
    const isCategory = await categoryExists(projectId, categoryId);

    if (!isProject){
        return errorMessageBuilder("The project does not exist");
    }
    if (!isCategory){
        return errorMessageBuilder("The category does not exist");
    }
    
    try{
        await updateDoc(task, taskDataToUpdate);
        return taskDataWithTimestamps;
    }
    catch (error){
        return errorMessageBuilder("The task does not exist", error.message);
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
 * @returns 
 */
export const updateTaskCategory = async (projectId, categoryIdFrom, categoryIdTo, taskId) => {
    // TODO: this function needs to delete the task, update when
    // TODO: the delete operations are added
};