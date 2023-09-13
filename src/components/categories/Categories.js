"use client";

import React, { useContext, useEffect, useState } from "react";
import CategoryItem from "./CategoryItem";
import { useDispatch, useSelector } from "react-redux";
import { 
    categoriesProjectIdSelector, 
    categoriesSelector, 
    categoryIdsSelector,
    moveTaskToCategory,
    moveTaskToNewCategory,
    updateCategoryOrder, 
    updateTaskOrder
} from "@/redux/features/categoriesSlice";
import { SelectedProjectContext } from "../context/SelectedProjectProvider";
import { projectSelectorById } from "@/redux/features/projectsSlice";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskPreview from "../tasks/TaskPreview";


/**
 * Display the list of categories
 */
const Categories = () => {
    const { handleSelectProject } = useContext(SelectedProjectContext);

    const dispatch = useDispatch();
    const categories = useSelector(categoriesSelector);
    const categoriesIds = useSelector(categoryIdsSelector);
    const projectId = useSelector(categoriesProjectIdSelector);
    const project = useSelector(projectSelectorById(projectId));

    // console.log(categoriesIds, categories);

    const [activeCategory, setActiveCategory] = useState(null);
    const [activeTask, setActiveTask] = useState(null);

    const pointerSensor = useSensor(PointerSensor, {
        activationConstraint: {
            distance: 5
        }
    });
    const sensors = useSensors(pointerSensor);

    // useEffect(() => {
    //     handleSelectProject(project);
    // }, [project]);

    const handleCreatePortal = () => {
        if (typeof window === "object") {
            return createPortal(<DragOverlay>
                {
                    activeCategory && <CategoryItem 
                        category={activeCategory} 
                        projectId={projectId}
                    />
                }
                {
                    activeTask && <TaskPreview
                        projectId={projectId}
                        categoryId={activeTask.categoryId}
                        taskId={activeTask.taskId}
                    />
                }
            </DragOverlay>, document.body);
        }
        return null;
    };

    const handleOnDragStart = (e) => {
        console.log("drag start", e);

        // save the dragging column
        if (e.active.data.current?.type === "Column" ){
            setActiveCategory(e.active.data.current.category);
            return;
        }

        if (e.active.data.current?.type === "Task" ){
            setActiveTask({
                taskId: e.active.data.current.task.id, 
                categoryId: e.active.data.current.categoryId
            });
            return;
        }
    };

    const handleOnDragEnd = (e) => {
        console.log("drag end", e);
        setActiveCategory(null);
        setActiveTask(null);

        const {active, over} = e;
        if (!over) {
            return;
        }

        if (e.active.data.current?.type === "Column"){
            const activeColumnId = active.id;
            const overColumnId = over.id;

            if (activeColumnId === overColumnId){
                return;
            }

            const indexSource = categoriesIds.findIndex(
                categoryId => categoryId === activeColumnId);
            const indexDestination = categoriesIds.findIndex(
                categoryId => categoryId === overColumnId);
            // dnd kit function that places the column in the right place
            const categoryIds = arrayMove(categoriesIds, indexSource, indexDestination);
       
            dispatch(updateCategoryOrder(categoryIds));
        }
        return;
    };

    const handleOnDragOver =(e) => {
        console.log("drag over", e);

        const {active, over} = e;
        if (!over) {
            return;
        }

        const activeCategoryId = e.active.data.current.categoryId;
        const tasksIds = categories[activeCategoryId].tasks;
        const activeTaskId = active.id;
        const overId = over.id;

        const isActiveTask = active.data.current?.type === "Task";
        const isOverTask = over.data.current?.type === "Task";

        if (!isActiveTask) {
            return;
        }

        const activeTaskCategoryId = active.data.current?.categoryId;
        let overTaskCategoryId;

        if (isOverTask) {
            overTaskCategoryId = over.data.current?.categoryId;
        }
        else{
            // it will be a column since I have already checked if 
            // it is null
            overTaskCategoryId = overId;
        }

        // check if the columns are the same and reorder the tasks
        if (activeTaskCategoryId === overTaskCategoryId){
            const indexSource = tasksIds.findIndex(id => id === activeTaskId);
            const indexDestination = tasksIds.findIndex(id => id === overId);

            const taskIds = arrayMove(tasksIds, indexSource, indexDestination);

            dispatch(updateTaskOrder({categoryId: activeCategoryId, taskIds}));
        }

        // check if the columns are different and move the task to 
        // the new column, in the right position

        if (activeTaskCategoryId !== overTaskCategoryId) {
            if (isOverTask){
                const activeTaskIds = tasksIds.filter(id => id !== activeTaskId);
                const overTasksIds = categories[overTaskCategoryId].tasks;
    
                const indexSource = overTasksIds.findIndex(id => id === activeTaskId);
                const indexDestination = overTasksIds.findIndex(id => id === overId);
    
                const taskIds = arrayMove(overTasksIds, indexSource, indexDestination);
    
                dispatch(moveTaskToCategory({
                    categoryIdFrom: activeTaskCategoryId, 
                    categoryIdTo: overTaskCategoryId, 
                    taskIdsFrom: activeTaskIds, 
                    taskIdsTo: taskIds
                }));
            }
    
    
            // check if the task is moved to another column and move
            // the task to the new column
    
            dispatch(moveTaskToNewCategory({
                categoryIdFrom: activeTaskCategoryId, 
                categoryIdTo: overTaskCategoryId, 
                taskId: activeTaskId
            }));
            
        }
       
    };

    return (
        <DndContext
            onDragStart={handleOnDragStart}
            onDragEnd={handleOnDragEnd}
            onDragOver={handleOnDragOver}
            sensors={sensors}>
            <section className="categories">
                <SortableContext items={categoriesIds}>
                    {
                        categoriesIds.map(categoryId => <CategoryItem 
                            key={categoryId} 
                            category={categories[categoryId]} 
                            projectId={projectId} />)
                    }
                    {handleCreatePortal()}
                </SortableContext>
            </section>
        </DndContext>
    );
};

export default Categories;
