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
import { 
    projectById, 
    projectSelectorById, 
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
    const { handleSelectProject } = useContext(SelectedProjectContext);

    const dispatch = useDispatch();
    const categories = useSelector(categoriesSelector);
    // const categoriesIds = useSelector(categoryIdsSelector);
    // const projectId = useSelector(categoriesProjectIdSelector);
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

    // useEffect(() => {
    //     handleSelectProject(project);
    // }, [project]);


    if (!project){
        return <p>loading</p>;
    }
    const categoriesIds = project.category_order;

    if (!categoriesIds){
        return <p>loading</p>;
    }

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

        if (active.data.current.type === "task"){
            console.log(moveTaskData);
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

    const handleOnDragOverOld =(e) => {
        console.log("drag over", e);

        const {active, over} = e;
        if (!over) {
            return;
        }

        const activeCategoryId = e.active.data.current.categoryId;

        // the active element is not a task, so it doesn't belong
        // to a category
        if (!activeCategoryId) return;

        const taskIdsFrom = categories[activeCategoryId].tasks;
        const activeTaskId = active.id;
        const overId = over.id;

        const isActiveTask = active.data.current?.type === "task";
        const isOverTask = over.data.current?.type === "task";

        if (!isActiveTask) {
            return;
        }

        const categoryIdFrom = active.data.current?.categoryId;
        let categoryIdTo;

        if (isOverTask) {
            categoryIdTo = over.data.current?.categoryId;
        }
        else{
            // it will be a column since I have already checked if 
            // it is null
            categoryIdTo = overId;
        }

        // check if the columns are the same and reorder the tasks
        if (categoryIdFrom === categoryIdTo){
            const indexSource = taskIdsFrom.findIndex(id => id === activeTaskId);
            const indexDestination = taskIdsFrom.findIndex(id => id === overId);

            const taskIds = arrayMove(taskIdsFrom, indexSource, indexDestination);

            // apiUpdateTaskAndCategory(
            //     projectId, categoryIdFrom, categoryIdTo, activeTaskId, taskIds);
            
            dispatch(updateTaskOrder({categoryId: activeCategoryId, taskIds}));
        }

        // check if the columns are different and move the task to 
        // the new column, in the right position

        if (categoryIdFrom !== categoryIdTo) {
            if (isOverTask){
                const activeTaskIds = taskIdsFrom.filter(id => id !== activeTaskId);
                const taskIdsTo = categories[categoryIdTo].tasks;
    
                const indexSource = taskIdsTo.findIndex(id => id === activeTaskId);
                const indexDestination = taskIdsTo.findIndex(id => id === overId);
    
                const taskIds = arrayMove(taskIdsTo, indexSource, indexDestination);

                // apiUpdateTaskAndCategory(
                //     projectId, categoryIdFrom, 
                //     categoryIdTo, activeTaskId, activeTaskIds);
    
                dispatch(moveTaskToCategory({
                    categoryIdFrom: categoryIdFrom, 
                    categoryIdTo: categoryIdTo, 
                    taskIdsFrom: activeTaskIds, 
                    taskIdsTo: taskIds
                }));
            }
    
            // apiUpdateTaskAndCategory(
            //     projectId, categoryIdFrom, categoryIdTo,
            //     activeTaskId, [categoryIdFrom]);
    
            // check if the task is moved to another column and move
            // the task to the new column
            

            dispatch(moveTaskToNewCategory({
                categoryIdFrom: categoryIdFrom, 
                categoryIdTo: categoryIdTo, 
                taskId: activeTaskId
            }));
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
            
            // apiUpdateTaskAndCategory(
            //     projectId, categoryIdFrom, categoryIdTo, activeTaskId, taskIdsTo);

            setMoveTaskData({
                categoryIdFrom, 
                categoryIdTo, 
                taskId: activeTaskId, 
                taskIdsFrom: taskIdsFromFiltered,
                taskIdsTo
            });

            // dispatch(moveTaskToCategory({
            //     categoryIdFrom: categoryIdFrom, 
            //     categoryIdTo: categoryIdTo, 
            //     taskIdsFrom: taskIdsFromFiltered, 
            //     taskIdsTo
            // }));
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

            // apiUpdateTaskAndCategory(
            //     projectId, categoryIdFrom, categoryIdTo, activeTaskId, taskIdsTo);

            setMoveTaskData({
                categoryIdFrom, 
                categoryIdTo, 
                taskId: activeTaskId, 
                taskIdsFrom: taskIdsFromFiltered,
                taskIdsTo
            });

            // dispatch(moveTaskToCategory({
            //     categoryIdFrom: categoryIdFrom, 
            //     categoryIdTo: categoryIdTo, 
            //     taskIdsFrom: taskIdsFromFiltered,
            //     taskIdsTo: taskIdsTo
            // }));
            return;
        }

        // otherwise, you are in the same category 
        // so change the order of the tasks
        const indexActiveTask = taskIdsTo.findIndex(taskId => taskId === activeTaskId);
        const indexOverTask = taskIdsTo.findIndex(taskId => taskId === overTaskId);
        const taskIds = arrayMove(taskIdsTo, indexActiveTask, indexOverTask);

        // apiUpdateTaskAndCategory(projectId, categoryIdFrom, categoryIdTo, activeTaskId, taskIds);

        setMoveTaskData({
            categoryIdFrom, 
            categoryIdTo, 
            taskId: activeTaskId, 
            taskIdsFrom: taskIds,
            taskIdsTo: taskIds
        });

        // dispatch(moveTaskToCategory({
        //     categoryIdFrom, 
        //     categoryIdTo: categoryIdFrom, 
        //     taskIdsTo: taskIds
        // }));

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
