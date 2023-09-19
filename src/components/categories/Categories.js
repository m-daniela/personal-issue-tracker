"use client";

import React, { useEffect, useState } from "react";
import CategoryItem from "./CategoryItem";
import { useDispatch, useSelector } from "react-redux";
import { 
    categoriesSelector, 
    moveTaskToCategory,
    updateCategoryOrder, 
} from "@/redux/features/categoriesSlice";
import { useSelectedProjectContext } from "../context/SelectedProjectProvider";
import { 
    projectById, 
    projectsSelector, 
    updateProject } from "@/redux/features/projectsSlice";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskPreview from "../tasks/TaskPreview";
import { apiUpdateProject, apiUpdateTaskAndCategory } from "../utils/apiCalls";


/**
 * Display the list of categories
 */
const Categories = ({projectId}) => {
    const { selectedProject, handleSelectProject } = useSelectedProjectContext();

    const dispatch = useDispatch();
    const categories = useSelector(categoriesSelector);
    const project = projectById(projectId, useSelector(projectsSelector));

    const [activeCategory, setActiveCategory] = useState(null);
    const [activeTask, setActiveTask] = useState(null);
    const [moveTaskData, setMoveTaskData] = useState(null);

    const pointerSensor = useSensor(PointerSensor, {
        activationConstraint: {
            distance: 5
        }
    });
    const sensors = useSensors(pointerSensor);

    useEffect(() => {
        handleSelectProject(project);
    }, [project, handleSelectProject]);


    if (!selectedProject){
        return <p>loading project</p>;
    }
    const categoriesIds = project.category_order;

    // TODO: overlay is not displaying anymore when moving 
    // TODO: over another category
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
        if (e.active.data.current?.type === "category"){
            setActiveCategory(e.active.data.current.category);
            return;
        }
        // save the dragging task
        if (e.active.data.current?.type === "task"){
            setActiveTask({
                taskId: e.active.data.current.task.id, 
                categoryId: e.active.data.current.categoryId
            });
            return;
        }
    };

    const handleOnDragEnd = async (e) => {
        console.log("drag end", e);
        setActiveCategory(null);
        setActiveTask(null);

        const {active, over} = e;
        if (!over) {
            return;
        }

        // if the active element is a category, update the 
        // category order and persist the changes
        if (active.data.current?.type === "category"){
            const activeColumnId = active.id;
            const overColumnId = over.id;

            if (activeColumnId === overColumnId){
                return;
            }

            const indexSource = categoriesIds.findIndex(
                categoryId => categoryId === activeColumnId);
            const indexDestination = categoriesIds.findIndex(
                categoryId => categoryId === overColumnId);

            const categoryIds = arrayMove(categoriesIds, indexSource, indexDestination);
            
            const updatedProject = {
                ...project, 
                category_order: categoryIds
            };
            
            dispatch(updateProject(updatedProject));
            dispatch(updateCategoryOrder(categoryIds));
            await apiUpdateProject(updatedProject);

            return;
        }

        // if the active element is a task, use the data collected
        // on drag and persist the changes
        if (active.data.current.type === "task"){

            if (moveTaskData){
                dispatch(moveTaskToCategory(moveTaskData));
                const {
                    categoryIdFrom, 
                    categoryIdTo, 
                    taskId,  
                    taskIdsTo} = moveTaskData;
                await apiUpdateTaskAndCategory(
                    projectId, categoryIdFrom, categoryIdTo,
                    taskId, taskIdsTo);
            }
            setMoveTaskData(null);
            return;
        }
    };


    const handleOnDragOver = (e) => {
        console.log("drag over", e);
        console.log(activeTask);

        const {active, over} = e;

        // if over = null, then you are outside of the dnd context
        if (!over) {
            return;
        }

        const activeElementType = active.data.current?.type;
        const overElementType = over.data.current?.type;

        // check if the active element is a task
        // if not, this should be handled by onDragEnd
        if (activeElementType !== "task") {
            return;
        }

        const activeTaskId = active.id;
        const categoryIdFrom = active.data.current.categoryId;
        const taskIdsFrom = categories[categoryIdFrom].tasks;

        let overTaskId;
        let categoryIdTo;
        let taskIdsTo;

        // check if the over element is a column
        // filter out the task from the source category
        // and move at the end of the destination category
        if (overElementType === "category") {
            categoryIdTo = over.id;

            // do nothing if the destination category is the same
            if (categoryIdFrom === categoryIdTo) return;

            taskIdsTo = [...categories[categoryIdTo].tasks, activeTaskId];
            const taskIdsFromFiltered = taskIdsFrom.filter(taskId => taskId !== activeTaskId);
            
            setMoveTaskData({
                categoryIdFrom, 
                categoryIdTo, 
                taskId: activeTaskId, 
                taskIdsFrom: taskIdsFromFiltered,
                taskIdsTo
            });

            return;
        }
        
        // the over element is a task
        overTaskId = over.id;
        categoryIdTo = over.data.current.categoryId;
        taskIdsTo = [...categories[categoryIdTo].tasks];

        // do nothing if it is over itself
        if (activeTaskId === overTaskId) return;

        // if the source and destination columns are different
        // filter out the task from the source category and
        // move the task at the right position in the destination
        // category (before the task it was over)
        if (categoryIdFrom !== categoryIdTo){
            const indexOverTask = taskIdsTo.findIndex(taskId => taskId === overTaskId);
            taskIdsTo.splice(indexOverTask <= 0 ? 0 : indexOverTask, 0, activeTaskId);
            const taskIdsFromFiltered = taskIdsFrom.filter(taskId => taskId !== activeTaskId);

            setMoveTaskData({
                categoryIdFrom, 
                categoryIdTo, 
                taskId: activeTaskId, 
                taskIdsFrom: taskIdsFromFiltered,
                taskIdsTo
            });

            return;
        }

        // otherwise, you are in the same category 
        // so change the order of the tasks
        const indexActiveTask = taskIdsTo.findIndex(taskId => taskId === activeTaskId);
        const indexOverTask = taskIdsTo.findIndex(taskId => taskId === overTaskId);
        const taskIds = arrayMove(taskIdsTo, indexActiveTask, indexOverTask);

        setMoveTaskData({
            categoryIdFrom, 
            categoryIdTo, 
            taskId: activeTaskId, 
            taskIdsFrom: taskIds,
            taskIdsTo: taskIds
        });

        return;
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
