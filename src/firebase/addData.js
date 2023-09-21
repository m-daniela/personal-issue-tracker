import db from "@/firebase/config";
import { dbCollectionNames, defaultCategories, errorMessageBuilder } from "@/utils/dbConstants";
import { doc, addDoc, collection, Timestamp, writeBatch, setDoc } from "firebase/firestore"; 
import { categoryExists, projectExists } from "./getData";
import { 
    updateCategory, 
    updateCategoryTaskArray, 
    updateProject, 
    updateProjectCategoryArray 
} from "./updateData";


/**
 * Add project
 * Add a new project. The categories are created
 * automatically, using the provided list of 
 * default categories
 * @param {object} projectData 
 * @returns new project object
 */
export const addProject = async (projectData) => {
    const projectDataWithTimestamps = {
        ...projectData, 
        created_at: Timestamp.fromDate(new Date()), 
        updated_at: Timestamp.fromDate(new Date()), 
    };
    const newProject = await addDoc(
        collection(db, dbCollectionNames.projectsPath), projectDataWithTimestamps);

    const category_order = [];

    const batch = writeBatch(db);

    try {
        defaultCategories.forEach((name, i) => {
            const categoryData = {
                name, 
                tasks: [],
                created_at: Timestamp.fromDate(new Date()), 
                updated_at: Timestamp.fromDate(new Date()), 
            };
            const category = doc(collection(
                db, ...dbCollectionNames.categoriesPath(newProject.id)));
            category_order.push(category.id);
            batch.set(category, categoryData);
        });
    
        await batch.commit();
        
        await updateProject(newProject.id, {category_order});
    
        return {
            "id": newProject.id, 
            ...projectDataWithTimestamps,
            category_order
        };
    }
    catch (error) {
        return errorMessageBuilder(error.message ? error.message : JSON.stringify(error));
    }
    
};


/**
 * Add a new category
 * The new category id is also added in the project's
 * category_order list, as the last element
 * @param {string} projectId 
 * @param {object} categoryData 
 * @returns new category data
 */
export const addCategory = async (projectId, categoryData) => {
    const isProject = await projectExists(projectId);
    if (!isProject){
        return errorMessageBuilder(`Could not retrieve project ${projectId}.`);
    }

    const categoryDataWithTimestamps = {
        ...categoryData, 
        tasks: [],
        created_at: Timestamp.fromDate(new Date()), 
        updated_at: Timestamp.fromDate(new Date()), 
    };
    
    const newCategory = await addDoc(
        collection(db, ...dbCollectionNames.categoriesPath(projectId)), categoryDataWithTimestamps);
    
    // add the category id to the project's category_order list
    const updateProjectMessage = await updateProjectCategoryArray(projectId, newCategory.id, true);
    if (updateProjectMessage.error){
        return updateProjectMessage;
    }

    return {
        id: newCategory.id,
        ...categoryDataWithTimestamps
    };
};


/**
 * Add task
 * Add a new task to the given project category 
 * @param {string} projectId 
 * @param {string} categoryId 
 * @param {object} taskData 
 * @returns the new task data
 */
export const addTask = async (projectId, categoryId, taskData) => {
    const isProject = await projectExists(projectId);
    const isCategory = await categoryExists(projectId, categoryId);
    if (!isProject){
        return errorMessageBuilder(`Could not retrieve project ${projectId}.`);
    }
    if (!isCategory){
        return errorMessageBuilder(`Could not retrieve category ${categoryId}.`);
    }
   
    const taskDataWithTimestamps = {
        ...taskData, 
        created_at: Timestamp.fromDate(new Date()), 
        updated_at: Timestamp.fromDate(new Date())
    };
    const newTask = await addDoc(
        collection(db, ...dbCollectionNames.tasksPath(
            projectId, categoryId)), taskDataWithTimestamps);
    const updateCategoryMessage = await updateCategoryTaskArray(
        projectId, categoryId, newTask.id, true);
    console.log(updateCategoryMessage);
    return {
        "id": newTask.id, 
        ...taskDataWithTimestamps
    };
};


/**
 * Add a task to the given category and update the order of the tasks
 * for that category
 * @param {string} projectId 
 * @param {string} categoryId 
 * @param {object} taskData 
 * @param {string[]} taskIdsTo 
 * @returns task data of the added task
 */
export const addTaskToCategory = async (projectId, categoryId, taskData, taskIdsTo) => {
    const {id, ...data} = taskData;
    await setDoc(doc(
        db, 
        ...dbCollectionNames.taskPath(projectId, categoryId, id)), 
    data, id);
    await updateCategory(projectId, categoryId, {tasks: taskIdsTo});
    return taskData;
};