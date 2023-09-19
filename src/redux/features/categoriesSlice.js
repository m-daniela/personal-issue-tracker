import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {};


export const categoriesSliceActuallyNormalized = createSlice({
    name: "categories", 
    initialState, 
    reducers: {
        setCategories: (state, action) => action.payload, 
        addTaskToCategory: (state, action) => {
            const categoryId = action.payload.categoryId;
            const task = action.payload.task;
            state.categories[categoryId].tasks.push(task.id);
            state.tasks[task.id] = task;
        }, 
        deleteTaskFromCategory: (state, action) => {
            const {categoryId, taskId} = action.payload;
            state.categories[categoryId].tasks = state.categories[categoryId]
                .tasks.filter(currentTaskId => currentTaskId !== taskId);
        }, 
        updateTask: (state, action) => {
            const task = action.payload.task;
            state.tasks[task.id] = task;
        }, 
        updateCategoryOrder: (state, action) => {
            return {
                ...state, 
                categoryIds: action.payload
            };
        },
        moveTaskToCategory: (state, action) => {
            const {categoryIdFrom, categoryIdTo, taskIdsFrom, taskIdsTo} = action.payload;

            if (categoryIdFrom === categoryIdTo) {
                return {
                    ...state, 
                    categories: {
                        ...state.categories,
                        [categoryIdFrom]: {
                            ...state.categories[categoryIdFrom], 
                            tasks: taskIdsTo
                        }
                    }
                };
            }
            return {
                ...state, 
                categories: {
                    ...state.categories, 
                    [categoryIdFrom]: {
                        ...state.categories[categoryIdFrom],
                        tasks: taskIdsFrom 
                    }, 
                    [categoryIdTo]: {
                        ...state.categories[categoryIdTo],
                        tasks: taskIdsTo
                    }
                }
            };
        }, 
    }
});

export const getTaskById = id => state => state.categories.tasks[id];
export const getTaskIdsFromCategory = id => state => state.categories[id];

export const categoriesSelector = (state) => state.categories.categories;
export const tasksSelector = (state) => state.categories.tasks;
export const categoriesProjectIdSelector = (state) => state.categories.id;
export const categoryIdsSelector = (state) => state.categories.categoryIds;

export const { 
    setCategories, 
    addTaskToCategory, 
    deleteTaskFromCategory, 
    updateTask, 
    moveTaskToCategory,
    moveTaskToNewCategory,
    updateCategoryOrder,
    updateTaskOrder
} = categoriesSliceActuallyNormalized.actions;

export default categoriesSliceActuallyNormalized.reducer;