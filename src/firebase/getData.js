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
        console.log(categories, tasksAndCategories);
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
 * the tasks) and an object with categoryName - categoryId 
 * pairs
 * @param {string} projectId 
 * @returns category data and an object with categoryName - 
 * categoryId pairs
 */
const getCategories = async (projectId) => {
    const categories = {};
    // const categoryIds = {};
    const categoryIds = [];
    const q = query(collection(
        db, ...dbCollectionNames.getCategoriesPath(projectId)));

    const snapshot = await getDocs(q);

    snapshot.forEach((document) => {
        const documentData = document.data();
        // categoryIds[documentData.name] = {
        //     id: document.id
        // };
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
 * Get the ids of the category in the given project
 * @param {string} projectId 
 * @param {string} categoryId 
 * @returns list of category ids from the project
 */
export const getCategoryIdsFromProject = async (projectId) => {
    const categoryIds = [];
    const q = query(collection(db, ...dbCollectionNames.categoriesPath(projectId)));
    const snapshot = await getDocs(q);

    snapshot.forEach((document) => categoryIds.push(document.id));

    return categoryIds;
};


/**
 * Get the ids of the tasks in the given category
 * @param {string} projectId 
 * @param {string} categoryId 
 * @returns list of task ids from the category
 */
export const getTaskIdsFromCategory = async (projectId, categoryId) => {
    const taskIds = [];
    const q = query(collection(db, ...dbCollectionNames.tasksPath(projectId, categoryId)));
    const snapshot = await getDocs(q);

    snapshot.forEach((document) => taskIds.push(document.id));

    return taskIds;
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
 * Get the category reference
 * @param {string} projectId 
 * @param {string} categoryId 
 * @returns category reference
 */
export const getCategoryReference = async (projectId, categoryId) => {
    const collectionPath = dbCollectionNames.categoryPath(projectId, categoryId);
    const docRef = doc(db, ...collectionPath);
    return await getDoc(docRef);
};

/**
 * Check if category exists
 * @param {string} projectId 
 * @param {string} categoryId 
 * @returns true if category exists, false otherwise
 */
export const categoryExists = async (projectId, categoryId) => {
    return (await getCategoryReference(projectId, categoryId)).exists();
};


/**
 * Get the data of a given category
 * @param {string} projectId 
 * @param {string} categoryId 
 * @returns category data
 */
export const getCategoryData = async (projectId, categoryId) => {
    return (await getCategoryReference(projectId, categoryId)).data();
};