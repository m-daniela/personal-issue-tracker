import { createSlice } from "@reduxjs/toolkit";

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
        }
    }
});

export const projectsSelector = (state) => state.projects;
export const projectSelectorById = (id) => (state) => {
    if (!id){
        return {};
    }
    const project = state.projects.filter(project => project.id === id);
    return project.length === 1 ? project[0] : {};
};

export const { setProjects, addProject, deleteProject, updateProject } = projectsSlice.actions;

export default projectsSlice.reducer;