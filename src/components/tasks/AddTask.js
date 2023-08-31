"use client";

import { addTaskToCategory } from "@/redux/features/categoriesSlice";
import { apiUrls, routes } from "@/utils/generalConstants";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch } from "react-redux";


/**
 * Add a new task
 * TODO: add the labels
 * TODO: show a message that the task was added
 * TODO: or go back to the project page
 * @param {string} projectId
 * @param {string} categoryId 
 * @returns 
 */
const AddTask = ({projectId, categoryId}) => {
    const dispatch = useDispatch();
    const router = useRouter();

    const handleSubmitNewTask = async (e) => {
        e.preventDefault();
        const taskData = {
            name: e.target[0].value,
            description: e.target[1].value,
            notes: e.target[2].value,
            labels: [],
        };
        const response = await fetch(
            apiUrls.addTask(projectId, categoryId), 
            {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(taskData)
            });
        const task = await response.json();

        dispatch(addTaskToCategory({categoryId, task}));

    };

    const handleBack = (e) => {
        e.preventDefault();
        // store.dispatch(setCategories(categories));
        router.back();
    };

    return (
        <form onSubmit={handleSubmitNewTask}>
            <label>Name</label>
            <input type="text" />
                
            <label>Description</label>
            <textarea />

            <label>Notes</label>
            <textarea />

            <div className="controls">
                <button className="secondary">
                    <Link href={routes.projectRoute(projectId)}>Go back</Link>
                </button>
                <button type="submit" className="primary">Add task</button>
            </div>
        </form>
    );
};

export default AddTask;
