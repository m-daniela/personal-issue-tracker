"use client";

import { addTaskToCategory } from "@/redux/features/categoriesSlice";
import { apiUrls, routes } from "@/utils/generalConstants";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import SnackbarWrapper from "../SnackbarWrapper";
import { TaskLabelDeletable } from "./TaskLabels";


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
    const [open, setOpen] = useState(true);
    const [labels, setLabels] = useState([]);
    const [label, setLabel] = useState("");
    const [message, setMessage] = useState({
        text: "", 
        isError: false
    });

    const handleSubmitNewTask = async (e) => {
        e.preventDefault();
        const taskData = {
            name: e.target[0].value,
            description: e.target[1].value,
            notes: e.target[2].value,
            labels,
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

        if (task.error) {
            setMessage({
                text: `Error while adding the task: ${task.error.message}`, 
                isError: true
            });
            setOpen(true);
        }
        else{
            setMessage({
                text: "The task was added", 
                isError: false
            });
            setOpen(true);
            dispatch(addTaskToCategory({categoryId, task}));
        }
    };

    const handleDeleteLabel = (labelName) => () => {
        console.log(labelName);
        setLabels(state => {
            return state.filter(label => label !== labelName);
        });
    };

    const handleAddLabel = (e) => {
        e.preventDefault();
        // console.log(e.target);
        setLabels(state => [...state, label]);
        setLabel("");
    };

    const handleBack = (e) => {
        e.preventDefault();
        // store.dispatch(setCategories(categories));
        router.back();
    };

    return (
        <>
            <form onSubmit={handleSubmitNewTask}>
                <label>Name</label>
                <input type="text" />
                
                <label>Description</label>
                <textarea />

                <label>Notes</label>
                <textarea />

                <label>Labels</label>
                <div className="task-labels">
                    {
                        labels.map((label, index) => <TaskLabelDeletable 
                            key={index}
                            label={label} 
                            handleDeleteLabel={handleDeleteLabel} />)
                    }
                </div>
                <div className="labels-controls">
                    <input 
                        type="text" 
                        placeholder="Label name..." 
                        value={label} 
                        onChange={e => setLabel(e.target.value)}/>
                    <button 
                        className="primary" 
                        onClick={handleAddLabel}>Add label</button>
                </div>
                <div className="controls">
                    <button className="secondary">
                        <Link href={routes.projectRoute(projectId)}>Go back</Link>
                    </button>
                    <button type="submit" className="primary">Add task</button>
                </div>
            </form>
            {
                message.text && 
                <SnackbarWrapper open={open} setOpen={setOpen} message={message.text} />
            }
        </>
        
    );
};

export default AddTask;
