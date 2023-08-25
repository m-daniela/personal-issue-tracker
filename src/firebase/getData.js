import db from "@/firebase/config";
import { dbCollectionNames } from "@/utils/dbConstants";
import { collection, query, getDocs, orderBy } from "firebase/firestore";


/**
 * Get projects
 * Get a list of objects with information about the projects, 
 * ordered by creation date.
 * No information about the categories will be returned
 * @returns list with project objects
 */
export const getProjects = async () => {
    const projects = [];
    const q = query(collection(db, dbCollectionNames.projectsPath), orderBy("created_at"));

    const snapshot = await getDocs(q);

    snapshot.forEach((document) => {
        projects.push({
            "id": document.id, 
            ...document.data()
        });
    });

    return projects;
};
