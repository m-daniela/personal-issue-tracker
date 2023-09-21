import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

const initialState = [];


export const projectsSlice = createSlice({
    name: "projects", 
    initialState, 
    reducers: {
        setProjects: (state, action) => action.payload,
        addProject: (state, action) => {
            state.push(action.payload);
        }, 
        deleteProject: (state, action) => {
            return state.filter(element => element.id !== action.payload.id);
        }, 
        updateProject: (state, action) => {
            return state.map(element => {
                if (element.id === action.payload.id){
                    return action.payload;
                }
                return element;
            });
        },
        updateProject2: (state, action) => {
            const {id, projectData} = action.payload;
            console.log(projectData);
            // TODO: remove the category id on category delete
            return state.map(element => {
                if (element.id === id){
                    console.log(element);
                    if (projectData.addCategoryId) {
                        return {
                            ...element, 
                            category_order: [...element.category_order, projectData.addCategoryId]
                        };
                    }
                    if (projectData.removeCategoryId) {
                        return {
                            ...element, 
                            category_order: element.category_order.filter(
                                categoryId => categoryId !== projectData.addCategoryId)
                        };
                    }
                    return {
                        ...element, 
                        name: projectData.name
                    };
                }
                return element;
            });
        }
    }
});

export const projectsSelector = (state) => state.projects;

export const projectById = (id, projects) => {
    if (!id){
        return null;
    }
    const project = projects.filter(project => project.id === id);
    return project.length === 1 ? project[0] : null;
};

export const useProjectSelectorById = (projectId) => {
    const projects = useSelector(projectsSelector);
    if (!projectId){
        return null;
    }
    const project = projects.filter(project => project.id === projectId);
    return project.length === 1 ? project[0] : null;
};

export const { setProjects, addProject, deleteProject, updateProject } = projectsSlice.actions;

export default projectsSlice.reducer;