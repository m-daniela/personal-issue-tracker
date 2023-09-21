"use client";

import React, { useState } from "react";
import TaskPreview from "../tasks/TaskPreview";
import Link from "next/link";
import { apiUrls, routes, draggableStyle } from "@/utils/generalConstants";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { useSortable } from "@dnd-kit/sortable";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import { useDispatch } from "react-redux";
import { deleteCategory, updateCategory, updateTaskOrder } from "@/redux/features/categoriesSlice";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { updateProject, useProjectSelectorById } from "@/redux/features/projectsSlice";
import SnackbarWrapper from "../SnackbarWrapper";


/**
 * Display the category item
 * This holds the available task present in a category
 * The link to the add task page is added at the "top"
 * of the category, the url params being properly set
 * @param {object} category 
 * @param {string} projectId 
 */
const CategoryItem = ({category, projectId}) => {
    const tasksIds = category.tasks;
    const dispatch = useDispatch();
    const project = useProjectSelectorById(projectId);
    const [updateOn, setUpdateOn] = useState(false);
    const [categoryName, setCategoryName] = useState(category.name);
    const [open, setOpen] = useState(true);
    const [message, setMessage] = useState({
        text: "", 
        isError: false
    });
    const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({
        id: category.id, 
        data: {
            type: "category", 
            category
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };

    const handleUpdateCategory = (e) => {
        e.preventDefault();
        setUpdateOn(state => !state);
    };

    const handleDeleteCategory = async (e) => {
        e.preventDefault();
        const response = await fetch(
            apiUrls.deleteCategory(projectId, category.id), 
            {
                method: "DELETE",
            });
        const deletedCategoryId = await response.json();
        if (deletedCategoryId.error) {
            setMessage({
                text: `Error while deleting the category: ${deletedCategoryId.error.message}`, 
                isError: true
            });
            setOpen(true);
        }
        else{
            setMessage({
                text: "", 
                isError: false
            });
            setOpen(false);
            const updatedProject = {
                ...project, 
                category_order: project.category_order.filter(
                    categoryId => categoryId !== category.id)
            };
            dispatch(updateProject(updatedProject));
            // dispatch(deleteCategory(category.id));
        }
    };

    const handleSubmitUpdate = async (e) => {
        e.preventDefault();
        const response = await fetch(
            apiUrls.updateCategory(projectId, category.id), 
            {
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    ...category, 
                    name: categoryName
                })
            });
        const updatedCategory = await response.json();
        if (updatedCategory.error) {
            setMessage({
                text: `Error while updating the category: ${updatedCategory.error.message}`, 
                isError: true
            });
            setOpen(true);
        }
        else{
            setMessage({
                text: "", 
                isError: false
            });
            setOpen(false);
            dispatch(updateCategory(updatedCategory));
            setUpdateOn(state => !state);
        }
        
    };


    if (isDragging){
        return (<div className="category-item" ref={setNodeRef}
            style={{
                ...style, 
                ...draggableStyle
            }}
            {...attributes}
            {...listeners}>
           
        </div>);
    }
    return (
        <>
            <div className="category-item" ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}>
                {updateOn ? 
                    <form className="controls" onSubmit={handleSubmitUpdate}>
                        <input
                            type="text"
                            value={categoryName} 
                            onChange={(e) => setCategoryName(e.target.value)}
                        />
                        <button type="submit">
                            <DoneOutlinedIcon />
                        </button>
                        <button onClick={handleUpdateCategory}>
                            <CloseOutlinedIcon />
                        </button>
                    </form>
                    :
                    <div className="controls">
                        <h2>{category.name}</h2>
                        <button onClick={handleUpdateCategory}>
                            <EditOutlinedIcon />
                        </button>
                        <button onClick={handleDeleteCategory}>
                            <DeleteOutlineOutlinedIcon />
                        </button>
                    </div>
                }
                
                <Link className="add-task-link" href={routes.addTaskRoute(projectId, category.id)}>
                    <AddOutlinedIcon />Add task
                </Link>
                <SortableContext items={tasksIds}>
                    {tasksIds?.map(taskId => <TaskPreview 
                        key={taskId}
                        projectId={projectId} 
                        categoryId={category.id} 
                        taskId={taskId} />)}
                </SortableContext>
            </div>
            { 
                message.isError && 
                <SnackbarWrapper open={open} setOpen={setOpen} message={message.text} />}
        </>
    );
};

export default CategoryItem;
