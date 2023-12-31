import db from "@/firebase/config";
import { dbCollectionNames, errorMessageBuilder } from "@/utils/dbConstants";
import { doc, getDoc, collection, query, getDocs, orderBy } from "firebase/firestore";


/**
 * Get projects
 * Get a list of objects with information about the projects, 
 * ordered by creation date.
 * No information about the categories will be returned
 * @returns list with project objects
 */
export const getProjects = async () => {
    const projects = [];
    const q = query(collection(db, dbCollectionNames.projectsPath), orderBy("created_at", "desc"));

    const snapshot = await getDocs(q);

    snapshot.forEach((document) => {
        projects.push({
            "id": document.id, 
            ...document.data()
        });
    });

    return projects;
};


/**
 * Get categories and tasks
 * Get the categories and tasks that are associated
 * with a project id, as well as a list of 
 * categoryName - categoryId objects
 * The data is normalized in the following format:
 * {
 *      projectId, 
 *      categoryIds, 
 *      categories, 
 *      tasks
 * }
 * @param {string} projectId 
 * @returns an object with the current project id, 
 * associated categories and tasks
 */
export const getCategoriesAndTasks = async (projectId) => {
    try {
        const {categories, categoryIds} = await getCategories(projectId);
        const tasksAndCategories = await getTasksByCategory(projectId, categories);
        return {
            id: projectId, 
            categoryIds,
            ...tasksAndCategories
        };
    }
    catch (error) {
        return errorMessageBuilder(
            `Could not retrieve categories and tasks for project ${projectId}`, 
            error.message ? error.message : JSON.stringify(error));
    }
    
};


/**
 * Get the categories
 * Returns a normalized object of category data (without
 * the tasks) and a list of categories, in th order in
 * which they will be displayed
 * @param {string} projectId 
 * @returns category data and a list of categories, in 
 * display order
 */
const getCategories = async (projectId) => {
    const categories = {};
    const categoryIds = [];
    const q = query(collection(
        db, ...dbCollectionNames.getCategoriesPath(projectId)));

    const snapshot = await getDocs(q);

    snapshot.forEach((document) => {
        const documentData = document.data();
        categoryIds.push(document.id);
        const categoryDetails = {
            "id": document.id, 
            ...documentData
        };
        categories[document.id] = categoryDetails;
    });

    return {
        categoryIds, 
        categories
    };
};


/**
 * Get the tasks by category
 * Get the task data by category and update the 
 * task ids list that corresponds to each category
 * Returns a normalized object of task data and the
 * updated categories data
 * @param {string} projectId 
 * @param {object} categories 
 * @returns categories data object, tasks data object
 */
export const getTasksByCategory = async (projectId, categories) => {
    const normalizedTasks = {};
    for (const categoryId in categories){
        const q = query(
            collection(db, ...dbCollectionNames.tasksPath(
                projectId, categoryId)), orderBy("created_at"));
        const snapshot = await getDocs(q);

        snapshot.forEach((document) => {
            const taskId = document.id;
            const taskData = document.data();
            normalizedTasks[taskId] = {
                "id": taskId, 
                ...taskData
            };
        });
    }

    return {
        categories, 
        tasks: normalizedTasks
    };
};


/**
 * Get project
 * @param {string} projectId 
 * @returns object with project data | null
 */
export const getProject = async (projectId) => {
    const collectionPath = dbCollectionNames.projectPath(
        projectId);
    const docRef = doc(db, ...collectionPath);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
        const project = {
            id: snapshot.id, 
            ...snapshot.data()
        };
        return project;
    }
    return null;
};


/**
 * Get category
 * @param {string} projectId 
 * @param {string} categoryId 
 * @returns object with category data | null
 */
export const getCategory = async (projectId, categoryId) => {
    const collectionPath = dbCollectionNames.categoryPath(
        projectId, categoryId);
    const docRef = doc(db, ...collectionPath);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
        const category = {
            id: snapshot.id, 
            ...snapshot.data()
        };
        return category;
    } 
    return null;
};


/**
 * Get task
 * @param {string} projectId 
 * @param {string} categoryId 
 * @param {string} taskId 
 * @returns object with task data
 */
export const getTask = async (projectId, categoryId, taskId) => {
    const collectionPath = dbCollectionNames.taskPath(
        projectId, categoryId, taskId);
    const docRef = doc(db, ...collectionPath);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
        const task = {
            id: snapshot.id, 
            ...snapshot.data()
        };
        return task;
    } else {
        return errorMessageBuilder(`Could not retrieve task ${taskId}.`);
    }
};


/**
 * Check if project exists
 * @param {string} projectId 
 * @returns true if project exists, false otherwise
 */
export const projectExists = async (projectId) => {
    const collectionPath = dbCollectionNames.projectPath(projectId);
    const docRef = doc(db, ...collectionPath);
    const snapshot = await getDoc(docRef);
    return snapshot.exists();
};

/**
 * Check if category exists
 * @param {string} projectId 
 * @param {string} categoryId 
 * @returns true if category exists, false otherwise
 */
export const categoryExists = async (projectId, categoryId) => {
    const collectionPath = dbCollectionNames.categoryPath(projectId, categoryId);
    const docRef = doc(db, ...collectionPath);
    return (await getDoc(docRef)).exists();
};
