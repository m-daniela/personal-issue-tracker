import db from "@/firebase/config";
import { dbCollectionNames, defaultCategories } from "@/utils/dbConstants";
import { doc, addDoc, collection, Timestamp, writeBatch, setDoc } from "firebase/firestore"; 
import { categoryExists, projectExists } from "./getData";


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
        collection(db, dbCollectionNames.projectsPath), 
        projectDataWithTimestamps);

    const batch = writeBatch(db);
    defaultCategories.forEach((name, i) => {
        const categoryData = {
            name, 
            order_no: i
        };
        const category = doc(collection(
            db, ...dbCollectionNames.categoriesPath(newProject.id)));
        batch.set(category, categoryData);
    });

    await batch.commit();
    

    return {
        "id": newProject.id, 
        ...projectDataWithTimestamps
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
        return {
            error: "The project does not exist"
        };
    }
    if (!isCategory){
        return {
            error: "The category does not exist"
        };
    }
    if (!taskData.id) {
        const taskDataWithTimestamps = {
            ...taskData, 
            created_at: Timestamp.fromDate(new Date()), 
            updated_at: Timestamp.fromDate(new Date())
        };
        const newTask = await addDoc(
            collection(db, ...dbCollectionNames.tasksPath(
                projectId, categoryId)), taskDataWithTimestamps);
        return {
            "id": newTask.id, 
            ...taskDataWithTimestamps
        };
    }
    const {id, ...data} = taskData;
    await setDoc(doc(
        db, 
        ...dbCollectionNames.taskPath(projectId, categoryId, id)), 
    data, id);
    return taskData;
};